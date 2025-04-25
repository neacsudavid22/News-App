import { useEffect, useRef, useState } from "react";

const useElementInView = (options) => {
  const [isInView, setIsInView] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const element = targetRef.current; 
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [targetRef, isInView];
};

export default useElementInView;
