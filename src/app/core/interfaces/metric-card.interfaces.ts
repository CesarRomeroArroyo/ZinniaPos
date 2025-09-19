export interface IMetricCardInputs {
    title: string;
    valueMetric: string;
    deltaMetric: string;
    graphicPoints: string;
    customizedDetailFunction?: () => void;
}