import React from 'react'
import './category.css'

const CategoryCard = ({img, mainText, count, imgAlt}) => {
  return (
    <>
        <div className='category-card'>
            {img ? (
              <img loading='lazy' src={img} alt={imgAlt} className='category-img'/>
            ) : (
              <div className='category-img category-img-fallback'>
                <span>{mainText?.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <h1 className='category-head'>{mainText}</h1>
            <p className='category-text'>{count} products</p>
        </div>
    </>
  )
}

export default React.memo(CategoryCard);