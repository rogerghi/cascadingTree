import React, { useState, useEffect, useRef, useMemo } from "react";
import { BriefcaseBusiness, Gauge, Target, User2 } from "lucide-react";
import { useTreeHeight } from "../cardWrapper";

const countLevelXCards = (children, currentLevel = 1, targetLevel = 4) => {
  let count = 0;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const childElems = React.Children.toArray(child.props.children).filter(
      React.isValidElement
    );

    const hasKids = childElems.length > 0;
    if (
      currentLevel === targetLevel ||
      (!hasKids && currentLevel < targetLevel)
    ) {
      count += 1;
    }
    if (hasKids) {
      count += countLevelXCards(childElems, currentLevel + 1, targetLevel);
    }
  });

  return count;
};

const analyzeChildrenLevelCards = (
  children,
  currentLevel = 1,
  targetLevel = 4
) => {
  const validChildren = React.Children.toArray(children).filter(
    React.isValidElement
  );

  const result = { first: 0, middle: [], last: 0 };

  validChildren.forEach((child, index) => {
    const grandkids = React.Children.toArray(child.props.children).filter(
      React.isValidElement
    );
    const cnt =
      grandkids.length === 0
        ? 1
        : countLevelXCards(grandkids, currentLevel + 1, targetLevel);

    if (index === 0) result.first = cnt;
    else if (index === validChildren.length - 1) result.last = cnt;
    else result.middle.push(cnt);
  });

  return result;
};

const TreeCard = ({ items, children = [], level = 1, handleButtonClick }) => {
  const { maxHeights, updateMaxHeight } = useTreeHeight();
  const cardRef = useRef(null);
  const [height, setHeight] = useState("auto");

  const hasChildren = Array.isArray(children) && children.length > 0;
  const isVertical = level >= 4;

  const sasaranTextColor = [2, 4, 5].includes(level)
    ? "text-black"
    : "text-white";

  const indikatorTextColor = [2, 4, 5].includes(level)
    ? "text-black"
    : [3].includes(level)
    ? "text-[#cdff00]"
    : "text-white";
  const targetTextColor = [2, 4, 5].includes(level)
    ? "text-black"
    : "text-white";
  const programTextColor = [].includes(level) ? "text-black" : "text-white";
  const pengampuTextColor =
    level === 1
      ? "text-[#cdff00]"
      : level === 2
      ? "text-[#0021c1]"
      : "text-white";

  const levelColors = {
    1: "bg-[#0a9348]",
    2: "bg-[#fbcc28]",
    3: "bg-[#0e5da0]",
    4: "bg-[#21a2dc]",
    5: "bg-[#a2a2a2]",
  };

  const levelTitle1 = {
    1: "Sasaran Strategis RPJMD (Ultimate Outcome)",
    2: "Sasaran Strategis Renstra PD (Intermediate Outcome)",
    3: "Sasaran Program (Intermediate Outcome)",
    4: "Sasaran Kegiatan (Immediate Outcome)",
    5: "Sasaran Sub Kegiatan (Output)",
  };
  const levelTitle2 = {
    1: "Indikator Strategis RPJMD (Ultimate Outcome)",
    2: "Indikator Strategis Renstra PD (Intermediate Outcome)",
    3: "Indikator Program (Intermediate Outcome)",
    4: "Indikator Kegiatan (Immediate Outcome)",
    5: "Indikator Sub Kegiatan (Output)",
  };
  const levelTitle3 = {
    1: null,
    2: null,
    3: "Nama Program",
    4: "Nama Kegiatan",
    5: "Nama Sub Kegiatan",
  };
  const sasaranHeader = levelTitle1[level] || "";
  const indikatornHeader = levelTitle2[level] || "";
  const programHeader = levelTitle3[level] || null;
  const bgColor = levelColors[level] || "bg-[#a2a2a2]";
  const cardHeight = level < 5 ? "h-auto" : "h-auto";
  const cardWidth = 350;
  const gap = 24;

  const analysis = useMemo(() => {
    if (level === 1 || level === 2)
      return analyzeChildrenLevelCards(children, level + 1, 4);
    return null;
  }, [children, level]);

  const totalGroupWidth = (numCards) =>
    numCards > 0 ? numCards * cardWidth + (numCards - 1) * gap : 0;

  const leftCrop = totalGroupWidth(analysis?.first || 0) / 2;
  const rightCrop = totalGroupWidth(analysis?.last || 0) / 2;

  const fixedCrop = `calc(175px)`;

  const renderHorizontalLine = !isVertical && children?.length > 1 && (
    <>
      {level === 3 && (
        <div
          className="absolute top-0 h-0.5 bg-gray-400"
          style={{ left: fixedCrop, right: fixedCrop }}
        />
      )}
      {(level === 1 || level === 2) && analysis && (
        <div
          className="absolute top-0 h-0.5 bg-gray-400"
          style={{
            left: `calc(${leftCrop}px)`,
            right: `calc(${rightCrop}px)`,
          }}
        />
      )}
    </>
  );
  useEffect(() => {
    if (cardRef.current) {
      const cardHeight = cardRef.current.offsetHeight;
      updateMaxHeight(level, cardHeight);
    }
  }, []);
  useEffect(() => {
    if (maxHeights[level]) {
      setHeight(maxHeights[level]);
    }
  }, [maxHeights]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Top vertical connector */}
      {level > 1 && level != 5 && <div className="w-0.5 h-6 bg-gray-400" />}

      {/* Card */}
      <div
        ref={cardRef}
        style={{ height: height }}
        // className={`rounded-2xl shadow-md py-5 px-3 min-w-[180px] text-left flex flex-col justify-start w-[350px] text-white ${bgColor}`}
        className={`rounded-2xl shadow-md p-3 min-w-[180px] text-left flex flex-col justify-start ${
          level == 5 ? `w-[280px] mt-5` : `w-[350px]`
        } text-white ${bgColor} ${cardHeight}`}
      >
        <div className={`flex flex-col mb-2 ${sasaranTextColor}`}>
          <span className="text-xs font-normal flex gap-2 items-center">
            <Target size={16} />
            {sasaranHeader}
          </span>
          <span className="text-base font-medium pl-[24px]">
            {level == 1
              ? items?.sasaran_strategis
              : items?.sasaran_strategis_satker}
          </span>
        </div>

        <div className={`flex flex-col mb-2 ${indikatorTextColor}`}>
          <span className="text-xs font-normal flex gap-2 items-center">
            <Gauge size={16} />
            {indikatornHeader}
          </span>
          {level == 1 ? (
            Array.isArray(items?.indikator_sasaran_strategis) &&
            items?.indikator_sasaran_strategis.length > 1 ? (
              <ul className="pl-[32px] list-disc space-y-1">
                {items?.indikator_sasaran_strategis.map((item, idx) => (
                  <li key={idx} className="text-base font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-base font-medium pl-[24px]">
                {Array.isArray(items?.indikator_sasaran_strategis)
                  ? items?.indikator_sasaran_strategis[0]
                  : items?.indikator_sasaran_strategis}
              </span>
            )
          ) : Array.isArray(items.iku) && items.iku.length > 1 ? (
            <ul className="pl-[32px] list-disc space-y-1">
              {items.iku.map((item, idx) => (
                <li key={idx} className="text-base font-medium">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-base font-medium pl-[24px]">
              {Array.isArray(items.iku) ? items.iku[0] : items.iku}
            </span>
          )}
        </div>
        {level > 2 && <hr className="mt-3 mb-5 border-t-2" />}
        <div className={`flex flex-col mb-2 ${pengampuTextColor}`}>
          <span className="text-xs font-normal flex gap-2 items-center">
            <User2 size={16} />
            Pengampu
          </span>
          <span className="text-base font-medium pl-[24px]">
            {items?.pengampu}
          </span>
        </div>
      </div>

      {/* Vertical connector to children */}
      {hasChildren && level !== 4 && <div className="w-0.5 h-6 bg-gray-400" />}

      {/* Children wrapper */}
      {hasChildren && level !== 4 && (
        <div
          className={`relative ${
            isVertical ? "flex flex-col items-center" : "flex gap-6 items-start"
          }`}
        >
          {renderHorizontalLine}
          {children.map((child, index) => (
            <div key={index} className="relative flex flex-col items-center">
              {React.cloneElement(child, { level: level + 1 })}
            </div>
          ))}
        </div>
      )}
      {hasChildren && level === 4 && (
        <div className="relative flex flex-col gap-2 ml-4 ">
          {/* Vertical line connecting all children */}
          <div className="absolute left-0 top-0 bottom-[260px] w-0.5 bg-gray-400" />

          {children.map((child, index) => (
            <div key={index} className="relative flex items-center">
              {/* "L" shaped line */}
              <div className="relative w-6 h-full flex items-center justify-center">
                {/* Horizontal line */}
                <div className="h-0.5 w-full bg-gray-400" />
              </div>
              {/* Level 5 card */}
              {React.cloneElement(child, { level: level + 1 })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeCard;
