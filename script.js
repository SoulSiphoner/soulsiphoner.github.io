const balanceInput = document.getElementById('balance');
const savingsInput = document.getElementById('savings');
const paydayInput = document.getElementById('payday');
const daysEl = document.getElementById('days-until');
const spendEl = document.getElementById('daily-spend');
const summaryEl = document.getElementById('summary');

const MS_IN_DAY = 24 * 60 * 60 * 1000;

function setDefaultPayday() {
  const today = normalizeDate(new Date());
  const defaultPayday = new Date(today);
  defaultPayday.setDate(defaultPayday.getDate() + 14);
  paydayInput.value = defaultPayday.toISOString().slice(0, 10);
}

function normalizeDate(date) {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

function parseCurrencyInput(value) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getNextPayday(basePayday) {
  const today = normalizeDate(new Date());
  const nextPayday = normalizeDate(basePayday);

  while (nextPayday <= today) {
    nextPayday.setDate(nextPayday.getDate() + 14);
  }

  const daysUntil = Math.ceil((nextPayday - today) / MS_IN_DAY);
  return { nextPayday, daysUntil };
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updatePlan() {
  const balance = parseCurrencyInput(balanceInput.value);
  const savings = parseCurrencyInput(savingsInput.value);
  const paydayValue = paydayInput.value;

  if (!paydayValue) {
    daysEl.textContent = '--';
    spendEl.textContent = '--';
    summaryEl.textContent = 'Add your next payday to start planning.';
    return;
  }

  const basePayday = new Date(`${paydayValue}T00:00:00`);
  if (Number.isNaN(basePayday.getTime())) {
    daysEl.textContent = '--';
    spendEl.textContent = '--';
    summaryEl.textContent = 'Payday date is invalid. Please choose a valid date.';
    return;
  }

  const { nextPayday, daysUntil } = getNextPayday(basePayday);
  const available = balance - savings;
  const dailySpend = daysUntil > 0 ? available / daysUntil : 0;

  daysEl.textContent = daysUntil.toString();
  spendEl.textContent = formatCurrency(Math.max(dailySpend, 0));

  if (available < 0) {
    summaryEl.textContent = `You're short by ${formatCurrency(Math.abs(available))} to hit your savings goal before payday (${nextPayday.toDateString()}).`;
  } else {
    summaryEl.textContent = `You can spend ${formatCurrency(Math.max(dailySpend, 0))} per day until ${nextPayday.toDateString()} without missing your savings goal.`;
  }
}

[balanceInput, savingsInput, paydayInput].forEach((input) => {
  input.addEventListener('input', updatePlan);
});

window.addEventListener('DOMContentLoaded', () => {
  setDefaultPayday();
  updatePlan();
});
