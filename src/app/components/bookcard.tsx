interface BookCardProps {
    bookName: string;
    bookAuthorName: string;
    bookCover: string;
    bookSynopsis: string;
    bookPrice: number;
}

export default function BookCard(props: BookCardProps) {
    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src={`http://localhost:5000/${props.bookCover.replace(/\\/g, '/')}`}
                    alt={props.bookName}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{props.bookName}</h2>
                <p className="text-sm text-gray-600">by {props.bookAuthorName}</p>
                <p>{props.bookSynopsis}</p>
                <div className="card-actions justify-between items-center mt-2">
                    <span className="font-bold text-blue-700">${props.bookPrice}</span>
                    <button className="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    );
}