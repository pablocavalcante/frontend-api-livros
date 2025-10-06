import MyLib from '../imgs/mylib.png';

export const Header = () => {
    return (
        <div className="flex justify-center shadow-md bg-blue-200">
            <h1 className="flex justify-center items-center">
                <img src={MyLib} alt="Logo do site" className='w-40'/>
            </h1>
        </div>
    )
}