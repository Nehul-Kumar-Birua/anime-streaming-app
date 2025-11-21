import { useRef, useState } from 'react';
import AnimeCard from '../AnimeCard/AnimeCard';
import './Carousel.css';

function Carousel({ title, animes }) {
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setShowLeftArrow(container.scrollLeft > 10);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
      );
    }, 300);
  };

  // Check if animes array exists and has items
  if (!animes || !Array.isArray(animes) || animes.length === 0) {
    console.log(`⚠️ No animes for section: ${title}`);
    return null;
  }

  console.log(`✅ Rendering carousel: ${title} with ${animes.length} items`);

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-wrapper">
        {showLeftArrow && (
          <button 
            className="carousel-arrow carousel-arrow-left" 
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}
        <div className="carousel-container" ref={carouselRef}>
          {animes.map((anime, index) => (
            <div key={anime.id || `anime-${index}`} className="carousel-item">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button 
            className="carousel-arrow carousel-arrow-right" 
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default Carousel;
