import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className=' w-full text-center bg-neutral-600 bg-opacity-35 text-neutral-400 py-2'>
      <div className='flex items-center justify-center gap-4'>
        <Link to={'/'}>About</Link>
        <Link to={'/'}>Contact</Link>      
      </div>
      <p>Created by: <strong>Rafhael Luis</strong></p>
    </div>
  )
}

export default Footer