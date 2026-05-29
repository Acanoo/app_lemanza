export type FinancingInput = {
  price: number;
  downPayment: number;
  annualRate: number;
  termMonths: number;
};

export function calculateFinancing({ price, downPayment, annualRate, termMonths }: FinancingInput) {
  const principal = Math.max(price - downPayment, 0);
  const monthlyRate = annualRate / 100 / 12;
  const monthlyFee =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

  let balance = principal;
  const schedule = Array.from({ length: termMonths }, (_, index) => {
    const interest = balance * monthlyRate;
    const capital = Math.min(monthlyFee - interest, balance);
    balance = Math.max(balance - capital, 0);
    return {
      number: index + 1,
      payment: monthlyFee,
      interest,
      capital,
      balance
    };
  });

  return { principal, monthlyFee, schedule };
}
