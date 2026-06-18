import { MainContent } from '@/components/layout/main-content';

export default function Home() {
  return (
    <MainContent title="Dashboard">
      <p style={{ color: 'var(--color-text-muted)' }}>
        Bienvenido a Fincas Pro. Seleccion\u00e1 un m\u00f3dulo desde la barra
        lateral para comenzar.
      </p>
    </MainContent>
  );
}
