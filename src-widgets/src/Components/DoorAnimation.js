import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import animationDoor from './animationDoor.json';

const DoorAnimation = props => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        setOpen(props.open);
        if (ref.current) {
            if (props.open) {
                ref.current.setDirection(1);
                ref.current.goToAndStop(0, true);
                ref.current.playSegments([0, 24], true);
                // ref.current.play();
            } else {
                ref.current.setDirection(-1);
                ref.current.goToAndStop(24, true);
                ref.current.playSegments([24, 0], true);
                // ref.current.play();
            }
        }
        // ref.current?.stop();
    }, [props.open]);
    return <Lottie
        animationData={animationDoor}
        onClick={() => setOpen(!open)}
        lottieRef={ref}
        autoPlay={false}
        loop={false}
        // start={200}
        style={{ height: 120 }}
    />;
};

export default DoorAnimation;
