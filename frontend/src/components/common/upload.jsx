export default ({ active, renderCollection, renderComputer }) => {
  return (
    <div className="full-screen overlay-background">
      <div className="overlay">
        <div className="top">
          <button
            className={`collection${active === "collection" ? " active" : ""}`}
          >
            Browse collection
          </button>
          <button
            className={`computer${active === "computer" ? " active" : ""}`}
          >
            From computer
          </button>
        </div>
        <div className="bottom">
          {active === "collection" && renderCollection}
          {active === "computer" && renderComputer}
        </div>
      </div>
    </div>
  );
};
