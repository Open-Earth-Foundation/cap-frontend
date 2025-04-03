import i18n from "i18next";

const PLAN_CREATOR_URL = "https://cap-plan-creator.openearth.dev";

export const generateActionPlan = async ({action, city}) => {
    try {
        const payload = {
            action: action, // Send the entire action object as-is
            city_name: city, // Changed from 'city' to 'city_name'
            language: i18n.language,
        };

        console.log("Sending request to start plan creation:", {
            url: `${PLAN_CREATOR_URL}/start_plan_creation`,
            payload,
        });

        // Step 1: Start plan creation and get task ID
        const startResponse = await fetch(
            `${PLAN_CREATOR_URL}/start_plan_creation`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            },
        );

        console.log("Start plan creation response status:", startResponse.status);
        console.log(
            "Start plan creation response headers:",
            Object.fromEntries(startResponse.headers.entries()),
        );

        // Log the raw response for debugging
        const responseText = await startResponse.text();
        console.log("Raw API Response:", responseText);

        if (!startResponse.ok) {
            throw new Error(`Failed to start plan generation: ${responseText}`);
        }

        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse JSON response:", e);
            throw new Error(`Invalid JSON response: ${responseText}`);
        }

        const task_id = responseData.task_id;
        if (!task_id) {
            throw new Error(
                `No task_id in response: ${JSON.stringify(responseData)}`,
            );
        }

        console.log("Successfully started plan creation with task_id:", task_id);

        // Step 2: Poll for completion
        let status = "pending";
        let attempts = 0;
        const maxAttempts = 30; // Maximum 30 attempts
        const pollInterval = 10000; // 10 seconds between attempts

        while (status === "pending" || status === "running") {
            console.log(
                `Checking progress for task ${task_id}, attempt ${attempts + 1} of ${maxAttempts}`,
            );

            const statusResponse = await fetch(
                `${PLAN_CREATOR_URL}/check_progress/${task_id}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                },
            );

            console.log("Check progress response status:", statusResponse.status);

            if (!statusResponse.ok) {
                const errorText = await statusResponse.text();
                console.error("Check progress error:", errorText);
                throw new Error(`Failed to check progress: ${errorText}`);
            }

            const statusData = await statusResponse.json();
            console.log("Check progress response:", statusData);

            status = statusData.status;

            if (status === "failed") {
                throw new Error(statusData.error || "Plan generation failed");
            }

            if (status === "pending" || status === "running") {
                if (attempts >= maxAttempts) {
                    throw new Error("Plan generation timed out after 5 minutes");
                }
                console.log(
                    `Waiting ${pollInterval / 1000} seconds before next check...`,
                );
                await new Promise((resolve) => setTimeout(resolve, pollInterval)); // Poll every 10 seconds
                attempts++;
            }
        }

        console.log(`Plan generation completed with status: ${status}`);

        // Step 3: Get the generated plan
        console.log(`Fetching plan for task ${task_id}`);

        const planResponse = await fetch(
            `${PLAN_CREATOR_URL}/get_plan/${task_id}`,
            {
                headers: {
                    Accept: "application/json",
                },
            },
        );

        console.log("Get plan response status:", planResponse.status);

        if (!planResponse.ok) {
            const errorText = await planResponse.text();
            console.error("Get plan error:", errorText);
            throw new Error(`Failed to retrieve plan: ${errorText}`);
        }

        const plan = await planResponse.text();
        console.log("Successfully retrieved plan");

        // Update state with the generated plan
        return {
            plan,
            timestamp: new Date().toISOString(),
            actionName: action?.ActionName,
        }
    } catch (error) {
        console.error("Error generating plan:", error);
        // Show error to user (you might want to add a toast or error state)
    }
}