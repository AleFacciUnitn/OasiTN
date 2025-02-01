export default function NavItem(props) {
    return (
        <div className="categories quicksand">
            <div className="w-full h-full items-center ">{props.name}</div>
            {props.children}
        </div>
    );
}
