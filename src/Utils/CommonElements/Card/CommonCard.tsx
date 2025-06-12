import React from 'react'
import './CommonCard.scss'
interface proprsType {
  children: any,
  height?:string,
  width?:string
}

const CommonCard : React.FC<proprsType> = ({children, height, width}) => {
  return (
    <div className='card__container' style={{height: height? height: '100%', width: width?width: '100%'}}>
      {children}
    </div>
  )
}

export default CommonCard