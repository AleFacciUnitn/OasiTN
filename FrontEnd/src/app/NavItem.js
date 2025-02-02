export default function NavItem(props) {
    return (
        <div className="categories grow quicksand relative">
            <div className="h-full">
            <div className="w-full h-full items-center ">{props.name}</div>
            {props.children}
            </div>
        </div>
    );
}
