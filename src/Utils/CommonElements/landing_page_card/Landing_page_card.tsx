import React from 'react'
import './Landing_page_card.scss';


interface landingPageCardProps {
    icon: JSX.Element | undefined;
    name: string;
    description: string,
    badge: boolean,
    badgeText : string | null
}


const Landing_page_card : React.FC<landingPageCardProps> =  ({icon, name, description, badge, badgeText }) => {
  return (
    <div className="custom-card">
    {
        badge 
        &&
        <div className="card-badge">
            <p className="badge-text">{badgeText}</p>
        </div>
    }
    <div className="card-icon">
        {icon}
    </div>
    <h1 className="card-title">{name}</h1>
    <p className="card-description truncate-3-lines">
      {description}
    </p>
  </div>
  )
}

export default Landing_page_card