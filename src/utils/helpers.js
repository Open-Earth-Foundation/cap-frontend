export function getReductionPotential(action) {
    let field;
    if (!action.sector) return ''
    switch (action.sector) {
        case 'Stationary Energy':
            field = 'energy';
            break;

        case "Transport":
            field = 'transportation';
            break;

        case "Waste":
            field = 'waste'
            break;
    }
    const fullField = `ghg_reduction_potential.${field}`
    console.log("{field, fullField}", JSON.stringify({
        sector: action.sector,
        field,
        fullField,
        out: action[fullField]
    }, null, 2)) // TODO NINA
    return action[fullField]
}