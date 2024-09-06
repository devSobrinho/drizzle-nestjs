export function generateCNPJ(): string {
  const random = (n: number) => Math.floor(Math.random() * n);

  const n = Array.from({ length: 12 }, () => random(9));
  n[8] = 0; // Define a base do CNPJ (parte do sufixo)
  n[9] = 0;
  n[10] = 0;
  n[11] = 1;

  const calcDv = (base: number[]) => {
    let t = base.length - 7;
    const d = base.reduce((acc, val) => acc + val * t--, 0);
    return d % 11 < 2 ? 0 : 11 - (d % 11);
  };

  const d1 = calcDv(n);
  const d2 = calcDv([...n, d1]);

  const cnpj = [...n, d1, d2].join('');

  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}
