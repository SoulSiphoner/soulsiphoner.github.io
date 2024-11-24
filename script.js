document.addEventListener("DOMContentLoaded", function() {
    calculateDaysUntilNextPaycheck();
    document.getElementById('balance').addEventListener('input', calculateBudget);
});

function calculateDaysUntilNextPaycheck() {
    const today = new Date();
    const startPayday = new Date('2024-11-18');

    // Calculate the number of days between the startPayday and today
    const msInDay = 24 * 60 * 60 * 1000;

    // Calculate the number of days since the start payday
    const daysSinceStart = Math.floor((today - startPayday) / msInDay);

    // Calculate the next payday
    const daysToNextPayday = 14 - (daysSinceStart % 14);
    const nextPayday = new Date(startPayday.getTime() + (daysSinceStart + daysToNextPayday) * msInDay);

    // Calculate the days until the next payday from today
    const daysUntilNextPaycheck = Math.ceil((nextPayday - today) / msInDay);

    // Update the days input field
    document.getElementById('days').value = daysUntilNextPaycheck;
}

function calculateBudget() {
    // Get the input values
    const balance = parseFloat(document.getElementById('balance').value);
    const days = parseInt(document.getElementById('days').value);

    // Ensure inputs are valid
    if (isNaN(balance) || isNaN(days) || days <= 0) {
        document.getElementById('result').classList.add('hidden');
        return;
    }

    // Calculate the daily budget
    const dailyBudget = (balance / days).toFixed(2);

    // Display the result
    document.getElementById('budgetAmount').innerText = `$${dailyBudget}`;
    document.getElementById('result').classList.remove('hidden');
}