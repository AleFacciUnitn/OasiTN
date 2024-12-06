export default function NavItem(props) {
    return (
        <div className="py-2 px-4 categories quicksand">
            {props.name}
            {props.children}
        </div>
    );
}