"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ModelViewer3d from "@/components/pages/viewer/ModelViewer3d";
import Loading from "./loading";
import { getStrapiURL } from "@/lib/utils";
import { GET_TRACTOR_BY_SLUG_VIEWER } from "@/graphql/queries/get-tractor-by-slug-viewer";
import { fetchData as graphqlFetchData } from "@/lib/graphql-operations";
import ibutton from "../../../../../public/images/ibutton.svg";

const TractorViewer = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [tractorData, setTractorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showArButton, setShowArButton] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [error, setError] = useState(null);

  const modelViewerRef = useRef(null);
  const baseUrl = getStrapiURL();

  useEffect(() => {
    const fetchTractor = async () => {
      try {
        const response = await graphqlFetchData(GET_TRACTOR_BY_SLUG_VIEWER, { slug });
        const tractor = response.tractors.data;

        if (!tractor || tractor.length === 0) throw new Error("No tractor found");

        setTractorData(tractor[0]);
        const defaultColor = tractor[0]?.attributes?.colors?.data[0]?.attributes;
        setActiveColor({
          name: defaultColor?.colorName,
          code: defaultColor?.colorCode,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTractor();

    // This only runs in browser
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|blackberry|iemobile|opera mini/i.test(ua);
      const isIPhone = /ipad|iphone|ipod/.test(ua);
      if (isMobile && !isIPhone) {
        setShowArButton(true);
      }
    }
  }, [slug]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  const { GLBfile, colors, name, tractor_category, HotspotDetail } =
    tractorData.attributes || {};
  const modelPath = baseUrl + GLBfile?.data?.attributes?.url;

  return (
    <section className="web-3d">
      <div className="web-3d-image">
        <ModelViewer3d
          ref={modelViewerRef}
          activeColor={activeColor}
          hotspotData={HotspotDetail}
          modelPath={modelPath}
          onModelLoaded={() => setModelLoading(false)}
        />
        {modelLoading && (
          <div className="loader-3d-model-viewer">
            <Loading />
          </div>
        )}
      </div>

      <div className="web-3d-option">
        <div className="colors">
          {colors?.data.map((color, index) => (
            <button
              key={index}
              style={{ backgroundColor: color.attributes.colorCode }}
              className="color-btn"
              onClick={() =>
                setActiveColor({
                  name: color.attributes.colorName,
                  code: color.attributes.colorCode,
                })
              }
            />
          ))}
        </div>

        <div className="modal-name">
          <ul>
            <li><span className="name">{name}</span></li>
            <li><span>{tractor_category?.data?.attributes?.name}</span></li>
          </ul>
        </div>

        <div className="info-exit-row">
          <div
            className="tooltip-icon"
            onClick={() => setShowTooltip(!showTooltip)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <img src={ibutton.src} alt="Info" width={24} height={24} />
            {showTooltip && (
              <div className="custom-tooltip">
                <div className="tooltip-arrow" />
                <div className="tooltip-content">
                  This is your tooltip info message!
                </div>
              </div>
            )}
          </div>

          <button className="exit-btn" onClick={() => router.back()}>
            Exit
          </button>
        </div>
      </div>

      {showArButton && (
        <div className="ar-btn">
          <button onClick={() => modelViewerRef.current?.enterAR?.()}>
            AR View
          </button>
        </div>
      )}
    </section>
  );
};

export default TractorViewer;
