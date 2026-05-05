export const getOrderStatusStyle = (status: string) => {
    const styles = {
        'fulfilled': { border: "1px solid #00951B", color: "#00951B" },
        'unfulfilled': { border: "1px solid #FFA500", color: "#FFA500" },
        'partially-fulfilled': { border: "1px solid #007BFF", color: "#007BFF" },
    };
    return styles[status as keyof typeof styles] || styles['unfulfilled'];
};