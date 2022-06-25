import React, {
    createRef, useEffect, useRef, useState,
} from 'react';
import I18n from '@iobroker/adapter-react-v5/i18n';
import clsx from 'clsx/dist/clsx';
import IconAdapter from '@iobroker/adapter-react-v5/Components/Icon';
import cls from './style.module.scss';
import clearSky from './iconsWeather/clearSky.svg';
import fewClouds from './iconsWeather/fewClouds.svg';
import scatteredClouds from './iconsWeather/scatteredClouds.svg';
import brokenClouds from './iconsWeather/brokenClouds.svg';
import showerRain from './iconsWeather/showerRain.svg';
import rain from './iconsWeather/rain.svg';
import thunderstorm from './iconsWeather/thunderstorm.svg';
import snow from './iconsWeather/snow.svg';
import mist from './iconsWeather/mist.svg';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const icons = [{
    icon: clearSky,
    name: ['01d', '01n'],
}, {
    icon: fewClouds,
    name: ['02d', '02n'],
}, {
    icon: scatteredClouds,
    name: ['03d', '03n'],
}, {
    icon: brokenClouds,
    name: ['04d', '04n'],
}, {
    icon: showerRain,
    name: ['09d', '09n'],
}, {
    icon: rain,
    name: ['10d', '10n'],
}, {
    icon: thunderstorm,
    name: ['11d', '11n'],
}, {
    icon: snow,
    name: ['13d', '13n'],
}, {
    icon: mist,
    name: ['50d', '50n'],
},
];

export const getIcon = (nameUri, decode) => {
    let name = nameUri;
    if (decode && nameUri) {
        name = decodeURI(nameUri.toString().split('/').pop().split('.')[0]);
    }
    const search = icons.find(el => el.name.find(nameIcon => nameIcon === name));
    if (search) {
        return search.icon;
    }
    return icons[0].icon;
};

const getWeekDay = (date, index) => {
    const dayNumber = date.getDay();
    const idx = (dayNumber + index) > 6 ? (dayNumber + index) - 7 : (dayNumber + index);
    return days[idx];
};
const Weather = ({
    doubleSize,
    socket,
    data,
    hideCurrent,
    hideDays,
}) => {
    if (!data) {
        return;
    }
    const temperatureCallBack = (_, state) => {
        if (state?.val && temperature.current) {
            temperature.current.innerHTML = `${Math.round(state.val)}°C`;
        }
    };

    const humidityCallBack = (_, state) => {
        if (state?.val && humidity.current) {
            humidity.current.innerHTML = `${Math.round(state.val)}%`;
        }
    };

    const [title, setTitle] = useState('');
    const [iconName, setIconName] = useState('');

    const titleCallBack = (_, state) => {
        if (state?.val) {
            setTitle(state.val);
        }
    };

    const iconCallBack = (_, state) => {
        if (state?.val) {
            setIconName(state.val || '');
        }
    };

    useEffect(() => {
        data.current.temperature && getSubscribeState(data.current.temperature, temperatureCallBack);
        data.current.humidity && getSubscribeState(data.current.humidity, humidityCallBack);
        data.current.state && getSubscribeState(data.current.state, titleCallBack);
        data.current.icon && getSubscribeState(data.current.icon, iconCallBack);
        return () => {
            data.current.temperature && socket.unsubscribeState(data.current.temperature, temperatureCallBack);
            data.current.humidity && socket.unsubscribeState(data.current.humidity, humidityCallBack);
            data.current.state && socket.unsubscribeState(data.current.state, titleCallBack);
            data.current.icon && socket.unsubscribeState(data.current.icon, iconCallBack);
        };
    }, []);

    const temperature = useRef();
    const humidity = useRef();
    const titleIcon = useRef();

    const date = new Date();

    const arrLength = data.days.length;

    ///
    const [temperatureMinRefs, setTemperatureMinRefs] = useState([]);
    const [temperatureMaxRefs, setTemperatureMaxRefs] = useState([]);
    const [titleRefs, setTitleRefs] = useState([]);
    const [iconNames, setIconNames] = useState([]);

    const getSubscribeState = (id, cb) => {
        socket.getState(id).then(result => cb(id, result));
        socket.subscribeState(id, (resultId, result) => cb(id, result));
    };

    useEffect(() => {
        setTemperatureMinRefs(temperatureMinRefs => (
            Array(arrLength).fill().map((_, i) => temperatureMinRefs[i] || createRef())
        ));
        setTemperatureMaxRefs(temperatureMaxRefs => (
            Array(arrLength).fill().map((_, i) => temperatureMaxRefs[i] || createRef())
        ));
        setTitleRefs(titleRefs => (
            Array(arrLength).fill().map((_, i) => titleRefs[i] || '')
        ));
        setIconNames(iconNames => (
            Array(arrLength).fill().map((_, i) => iconNames[i] || '')
        ));
    }, [arrLength, hideCurrent, hideDays]);

    const getIndex = (idx, callBack) => (_, state) => callBack(state, idx);

    const temperatureMinCallBack = (state, idx) => {
        if (state?.val && temperatureMinRefs[idx]?.current) {
            temperatureMinRefs[idx].current.innerHTML = `${Math.round(state.val)}°C`;
        }
    };

    const temperatureMaxCallBack = (state, idx) => {
        if (state?.val && temperatureMaxRefs[idx]?.current) {
            temperatureMaxRefs[idx].current.innerHTML = `${Math.round(state.val)}°C`;
        }
    };

    const titleMinCallBack = (state, idx) => {
        if (state?.val) {
            setTitleRefs(titleRefs => titleRefs.map((_, i) => (i === idx ? state.val : titleRefs[i])));
        }
    };

    const iconsCallBack = (state, idx) => {
        if (state?.val) {
            setIconNames(iconNames => iconNames.map((_, i) => (i === idx ? state.val : iconNames[i])));
        }
    };

    useEffect(() => {
        const callBacks = [];
        if (temperatureMinRefs.length) {
            for (let i = 0; i < data.days.length; i++) {
                callBacks[i] = {
                    min: getIndex(i, temperatureMinCallBack),
                    max: getIndex(i, temperatureMaxCallBack),
                    state: getIndex(i, titleMinCallBack),
                    icon: getIndex(i, iconsCallBack),
                };
                data.days[i].temperatureMin && getSubscribeState(data.days[i].temperatureMin, callBacks[i].min);
                data.days[i].temperatureMax && getSubscribeState(data.days[i].temperatureMax, callBacks[i].max);
                data.days[i].state && getSubscribeState(data.days[i].state, callBacks[i].state);
                data.days[i].icon && getSubscribeState(data.days[i].icon, callBacks[i].icon);
            }
        }
        return () => {
            if (callBacks.length) {
                for (let i = 0; i < data.days.length; i++) {
                    data.days[i].temperatureMin && socket.unsubscribeState(data.days[i].temperatureMin, callBacks[i].min);
                    data.days[i].temperatureMax && socket.unsubscribeState(data.days[i].temperatureMax, callBacks[i].max);
                    data.days[i].state && socket.unsubscribeState(data.days[i].state, callBacks[i].state);
                    data.days[i].icon && socket.unsubscribeState(data.days[i].icon, callBacks[i].icon);
                }
            }
        };
    }, [temperatureMinRefs]);
    return <div className={cls.whetherkWrapper}>
        <div className={cls.wrapperBlock} style={{ display: hideCurrent ? 'none' : undefined }}>
            <div className={cls.iconWrapper}>
                <div className={clsx(cls.iconWhetherWrapper, (!arrLength || hideDays) && cls.noteArrayIcon)}>
                    <IconAdapter className={cls.iconWhether} src={getIcon(iconName, true) || clearSky} />
                </div>
                <div className={cls.styleText}>{title}</div>
            </div>
            <div>
                <div ref={temperature} className={cls.temperatureTop}>-°C</div>
                <div ref={humidity} className={cls.humidity}>-%</div>
            </div>
        </div>
        {arrLength > 0 && <div className={cls.wrapperBottomBlock} style={{ display: hideDays ? 'none' : undefined }}>
            {data.days.map((e, idx) => <div className={cls.wrapperBottomBlockCurrent} key={idx}>
                <div className={cls.date}>{I18n.t(getWeekDay(date, idx + 1))}</div>
                <div><IconAdapter className={cls.iconWhetherMin} src={getIcon(iconNames[idx], true) || clearSky} /></div>
                <div ref={temperatureMaxRefs[idx]} className={cls.temperature}>-°C</div>
                <div className={cls.temperature}>
                    <span ref={temperatureMinRefs[idx]}>-°C</span>
                </div>
                {/* <div>30°C<span>19°C</span></div> */}
            </div>)}
        </div>}
    </div>;
};

Weather.defaultProps = {
    secondsParams: false,
    hour12Params: false,
    dayOfWeekParams: false,
    date: false,
    doubleSize: false,
};

export default Weather;
