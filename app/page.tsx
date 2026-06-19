import { MainContent } from '@/components/layout/main-content';

export default function Home() {
  return (
    <MainContent title="Dashboard">
      <p style={{ color: 'var(--color-text-muted)' }}>
        Gestión de fincas simplificada. Tu comunidad, tus datos, sin
        complicaciones.
      </p>
    </MainContent>
  );
}
