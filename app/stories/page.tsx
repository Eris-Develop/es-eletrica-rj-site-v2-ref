
import PublicStories from '@/components/PublicStories';

export default function StoriesPage() {
  return (
    <>
      
       <main className="section">
        <div className="container">
          <div className="section-title">
            <div className="eyebrow">Stories</div>
            <h1>Obras, promoções e novidades</h1>
            <p>Conteúdos cadastrados no admin e exibidos automaticamente no site.</p>
          </div>

          <PublicStories />
        </div>
      </main>
    </>
  );
}
