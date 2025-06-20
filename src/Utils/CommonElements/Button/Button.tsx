import './Button.scss'

interface ButtonProps {
  onClick?: () => void;
  type?: 'submit' | "reset" | "button";
  width?: string | number;
  disabled?:boolean,
  children: React.ReactNode;
}
function Button(props:ButtonProps) {
  return (
    <button className='dynamic_button' onClick={props.onClick} type={props?.type} style={{width: props?.width ? props.width : 'auto'}} disabled={props?.disabled} > {props.children}</button>
  )
}

export default Button