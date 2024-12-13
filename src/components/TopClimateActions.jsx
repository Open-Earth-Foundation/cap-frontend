import React, {useState} from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import ActionDetailsModal from "./ActionDetailsModal.jsx";
import {getReductionPotential, isAdaptation, toTitleCase} from "../utils/helpers.js";
import PlanModal from "./PlanModal";


const TopClimateActions = ({actions, type, setSelectedAction, selectedCity}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState('');
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

    // Get top 3 actions of the specified type
    const topActions = actions
        .sort((a, b) => a.actionPriority - b.actionPriority)
        .slice(0, 3);



    const getProgressBars = (action) => {
        if (isAdaptation(type)) {
                const level = action.AdaptationEffectiveness;
                const filledBars = level === "high" ? 3 : level === "medium" ? 2 : 1;
                const color = level === "high"
                ? "bg-blue-500"
                : level === "medium"
                    ? "bg-blue-400"
                    : "bg-blue-300";

                return Array(3).fill().map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 w-1/2 rounded ${i < filledBars ? color : "bg-gray-200"}`}
                    />
                ));
                
        } else {
                // Mitigation logic
                const potential = getReductionPotential(action);
                const potentialValue = potential ? parseInt(potential.split('-')[0]) : 0; // Get the lower bound
                const getBarColor = (value) => {
                            if (value >= 80) return "bg-blue-500";    // Very high 
                            if (value >= 60) return "bg-blue-400";    // High 
                            if (value >= 40) return "bg-blue-300";  // Medium
                            if (value >= 20) return "bg-blue-200"; // Low 
                            return "bg-blue-100";                    // Very low
                        };
            
                        const filledBars = potentialValue >= 80 ? 5 
                            : potentialValue >= 60 ? 4 
                            : potentialValue >= 40 ? 3 
                            : potentialValue >= 20 ? 2 
                            : 1;
            
                        const color = getBarColor(potentialValue);
            
                        return Array(5).fill().map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 w-1/3 rounded ${
                                    i < filledBars ? color : "bg-gray-200"
                                }`}
                            />
                        ));
                    }
                };

            const generateActionPlan = async (action, type) => {
                setIsGenerating(true);
                try {
                    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
                    const actionType = isAdaptation(type) ? 'adaptation' : 'mitigation';
                    // Get the potential based on the type
                    const potential = isAdaptation(type) 
                        ? action.AdaptationEffectiveness 
                        : getReductionPotential(action);
                    const prompt = `Draft a brief step by step plan for this ${actionType} climate action in ${selectedCity}, Brazil:
                        Name: ${action.ActionName}
                        Description: ${action.Description}
                        ${isAdaptation(type) ? 'Adaptation' : 'Reduction'} Potential: ${potential}
                        ${isAdaptation(type) ? 'Hazard' : 'Sector'}: ${action.Sector || action.Hazard}
                        Cost: ${action.CostInvestmentNeeded}
                        Implementation Timeline: ${action.TimelineForImplementation}
                        ${action.CoBenefits ? `Co-benefits:${Object.keys(action.CoBenefits).join(',  ')}` : action.CoBenefits}
                        ${action.EquityAndInclusionConsiderations ? `Equity and Inclusion Considerations: ${action.EquityAndInclusionConsiderations}` : ''}
                        ${action.KeyPartnersAndResources ? `Key Partners and Resources: ${action.KeyPartnersAndResources}` : ''}
                        ${action.Barriers ? `Potential Barriers: ${action.Barriers}` : ''}`;
                    setGeneratedPrompt(prompt);
                    
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: `You are a climate action planning expert specializing in ${action.actionType} strategies, with deep experience in urban planning. Create concise, actionable implementation plans for a city planner to use. Propose rapid action that can be taken in the first year, try to instill a sense of urgency that shows impact in the short term, and extended impact in time. Be realistic, and specific. Generic proposals are of no use. Focus on real impact. Take into account the reality of the city selected. Use this template and Markdown formatting for the action plan:

## 1. In-depth main action description
[Provide a detailed description]

## 2. Proposed sub-actions
* [Action 1]
* [Action 2]
* [Action 3]

## 3. Involved municipal institutions and partners
* [Institution 1]
* [Institution 2]
* [Institution 3]

## 4. Goals and milestones
* [Goal 1]
* [Goal 2]
* [Goal 3]

## 5. Action timeline
**Short term (Year 1):**
* [Activities]

**Medium term (Year 2-3):**
* [Activities]

**Long term (Year 4-5):**
* [Activities]

## 6. Costs and budget considerations
* [Cost consideration 1]
* [Cost consideration 2]
* [Cost consideration 3]

## 7. Monitoring, Evaluation and Reporting (MER) indicators
* [Indicator 1]
* [Indicator 2]
* [Indicator 3]

## 8. Relationship with SDGs
* **SDG [Number]:** [Description]
* **SDG [Number]:** [Description]
`
                }, {
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 1000
            }, {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const plan = response.data.choices[0].message.content;
            console.log('Generated Plan:', plan);
            setGeneratedPlan(plan);
            props.setGeneratedPlan(plan); // Pass to parent
            console.log('Setting generated plan:', plan);
            setIsPlanModalOpen(true);
            return plan;
            
        } catch (error) {
            console.error('Error generating plan:', error);
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-normal text-gray-900 font-poppins">
                Top {type?.toLowerCase()} climate actions
            </h1>
            {/*Top Mitigatons Cards*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topActions.map(({action}, index) => (
                    /* Mitigation Card */
                    <div
                        key={index}
                        className={`p-6 space-y-4 border rounded-lg shadow-sm bg-white font-opensans ${
                    index === 0 
                            ? 'border-t-4 border-t-primary first-card ring-1 ring-blue-100' 
                            : 'shadow-sm'
                        }`}
                        >
                        {/*Index*/}
                        <div>
              <span className="text-4xl font-bold text-gray-900 font-poppins">
                {index + 1}°
              </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-gray-900 font-poppins">
                                {action.ActionName}
                            </h2>
                            <p className="text-gray-600 text-md line-clamp-2 font-opensans">
                                {action.Description}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="flex gap-2 ">
                                {getProgressBars(action)}
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span
                                    className="text-gray-600 ">{isAdaptation(type) ? "Adaptation Potential" : "Reduction Potential"}</span>
                                {/*<span className={getReductionColor(action.estimated_cost)}>*/}
                                <p className="text-gray-600 text-sm font-semibold line-clamp-2 font-opensans">
                                    {isAdaptation(type) ? toTitleCase(action.AdaptationEffectiveness) : `${getReductionPotential(action)}%`}
                                </p>
                                {/*</span>*/}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-2"/>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                  {isAdaptation(action.ActionType) ? "Hazard" : "Sector"}
                                </span>
                                <span className="text-gray-600  flex-1 ml-4 text-right font-semibold">
                                    {action?.Sector?.join ? 
                                        action.Sector.map(s => toTitleCase(s.replace('_', ' '))).join(', ') 
                                        : action?.Hazard?.join ? 
                                            action.Hazard.map(h => toTitleCase(h)).join(', ')
                                            : toTitleCase(String(action.Sector || action.Hazard || ''))}
                                </span>
                            </div>

                            <div className="flex justify-between ">
                                <span className="text-gray-600">Estimated cost</span>
                                <span className="text-gray-600 font-semibold">
                  {toTitleCase(action.CostInvestmentNeeded)}
                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Implementation time</span>
                                <span className="text-gray-600 font-semibold">
                  {action.TimelineForImplementation}
                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                            <button onClick={() => setSelectedAction(action)} className="button-link">
                                See more details
                            </button>
                            {index === 0 && (
                                <button
                                    onClick={() => generateActionPlan(action, type)}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    {isGenerating ? (
                                        <FiLoader className="animate-spin" />
                                    ) : (
                                        'Generate Plan'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <PlanModal 
                    isOpen={isPlanModalOpen}
                    onClose={() => setIsPlanModalOpen(false)}
                    prompt={generatedPrompt}
                    plan={generatedPlan}
                />
        </div>
    );
};

export default TopClimateActions;
