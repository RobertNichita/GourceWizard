export function Video(props) {
  const {data} = props;
  const {content} = data;
  return (
    <div className="flex justify-center m-2 hover:opacity-75">
      <div className="rounded-lg shadow-lg bg-white max-w-lg max-h-min">
        <a data-mdb-ripple="true" data-mdb-ripple-color="light">
          <img
            className="rounded-t-lg"
            src="https://cdna.artstation.com/p/assets/images/images/031/514/156/large/alena-aenami-budapest.jpg?1603836263"
            alt=""
          />
        </a>
        <div className="p-6">
          <div className="flex justify-start items-end mb-2">
            <h1 className="text-black text-xl font-medium mr-2">{content}</h1>
            <p className="text-gray-500 text-sm">CreatedAt Date</p>
          </div>
          <p className="text-base mb-4">Put Github Repo Desc. here?</p>
          <button type="button" className="btn-blue">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
