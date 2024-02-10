import React, { useEffect, useState, useRef } from "react";

export default function GaugeMeter() {
  const [percent, setPercent] = useState(0);
  const needleRef = useRef(null);

  useEffect(() => {

    const isAnimationPlayed = sessionStorage.getItem("animationPlayed")


    const fetchIndex = async () => {
      const response = await fetch("https://api.alternative.me/fng/?limit=1");

      const data = await response.json();

      setPercent(data.data[0]["value"] / 100);


      if(isAnimationPlayed) {

        needleRef.current.style.left = `${((data.data[0]["value"] / 100) *100).toFixed(0)}%`;

      } else {

        setTimeout(() => {
                needleRef.current.style.left = `${(
                (data.data[0]["value"] / 100) *
                100
                ).toFixed(0)}%`;
            }, 5500);

      }
      
    };

    fetchIndex();
  }, []);

  return (
    <div className="main_gauge_container">
    <div className="gauge_container">
      <div className="gauge_meter">
        <div ref={needleRef} className="gauge_needle"></div>
      </div>
    </div>
       <p className="index_percent">{(percent * 100).toFixed(0)}</p>
    </div>
  );
}
