describe('configuración de pruebas', () => {
  it('Jest funciona con TypeScript', () => {
    const suma = (a: number, b: number): number => a + b;
    expect(suma(2, 3)).toBe(5);
  });
});
