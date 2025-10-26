import React from "react";

export default function ProductNAD({ name, longDesc }) {
  return (
    <section className="nad">
      <h2 className="nad-title">{name}</h2>
      <div className="nad-body">
        {typeof longDesc === "string" ? (
          <p>{longDesc}</p>
        ) : (
          longDesc
        )}
      </div>
    </section>
  );
}
