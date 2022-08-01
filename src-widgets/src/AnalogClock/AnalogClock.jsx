// Source: https://github.com/mukanov8/analog-clock/blob/main/src/components/AnalogClock.tsx
/*
MIT License

Copyright (c) 2022 Ayan Mukanov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';

import AnalogClockBase from './AnalogClockBase';

const TIME_DEGREE_OFFSET = 90;
const calculateHourHandDegree = (hours, minutes) => hours * 30 + minutes * 0.5 - TIME_DEGREE_OFFSET;
const calculateMinuteHandDegree = (hours, minutes, seconds) => hours * 360 + minutes * 6 + seconds / 12 - TIME_DEGREE_OFFSET;
const calculateSecondHandDegree = (minutes, seconds) => minutes * 360 + seconds * 6 - TIME_DEGREE_OFFSET;

const styles = () => ({
    analogClock: {
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        verticalAlign: 'middle',
    },
    hourHand: {
        position: 'absolute',
        zIndex: 1,
        transformOrigin: 'center',
        transition: 'transform linear 0.5s',
    },
    minuteHand: {
        position: 'absolute',
        transformOrigin: 'center',
        transition: 'transform linear 0.5s',
    },
    secondHand: {
        position: 'absolute',
        transformOrigin: 'center',
        transition: 'transform linear 1s',
    },
});

class AnalogClock extends Component {
    render() {
        const time = new Date();
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        const secondsWidth = this.props.size * 0.45;
        const handsHeight = Math.round(this.props.size / 50);

        return <div className={this.props.classes.analogClock} style={this.props.style}>
            <AnalogClockBase
                backgroundColor={this.props.backgroundColor || (this.props.themeType === 'dark' ? '#111' : '#EEE')}
                ticksColor={this.props.ticksColor || (this.props.themeType === 'dark' ? '#dedede' : '#212121')}
                handsColor={this.props.handsColor || (this.props.themeType === 'dark' ? '#dedede' : '#212121')}
                secondHandColor={this.props.secondHandColor || '#F44336'}
                showNumbers={this.props.showNumbers}
                size={this.props.size}
                withSeconds={this.props.withSeconds}
            >
                <div
                    className={this.props.classes.hourHand}
                    style={{
                        width: this.props.size * 0.3,
                        height: handsHeight,
                        borderRadius: `0 ${Math.round(handsHeight / 2)}px ${Math.round(handsHeight / 2)}px 0`,
                        backgroundColor: this.props.handsColor || (this.props.themeType === 'dark' ? '#dedede' : '#212121'),
                        transform: `rotate(${calculateHourHandDegree(hours, minutes)}deg) translateX(${this.props.size * 0.3 / 2}px)`,
                    }}
                />
                <div
                    className={this.props.classes.minuteHand}
                    style={{
                        width: this.props.size * 0.4,
                        height: handsHeight,
                        borderRadius: `0 ${Math.round(handsHeight / 2)}px ${Math.round(handsHeight / 2)}px 0`,
                        backgroundColor: this.props.handsColor || (this.props.themeType === 'dark' ? '#dedede' : '#212121'),
                        transform: `rotate(${calculateMinuteHandDegree(hours, minutes, seconds)}deg) translateX(${this.props.size * 0.4 / 2}px)`,
                    }}
                />
                {this.props.withSeconds ?
                    <div
                        className={this.props.classes.secondHand}
                        style={{
                            width: secondsWidth,
                            height: this.props.size / 100,
                            borderRadius: `0 ${Math.round(this.props.size / 500)}px ${Math.round(this.props.size / 500)}px 0`,
                            backgroundColor: this.props.secondHandColor || '#F44336',
                            transform: `rotate(${calculateSecondHandDegree(minutes, seconds)}deg) translateX(${secondsWidth / 2}px)`,
                        }}
                    />
                    : null}
            </AnalogClockBase>
        </div>;
    }
}

AnalogClock.propTypes = {
    backgroundColor: PropTypes.string,
    ticksColor: PropTypes.string,
    showNumbers: PropTypes.bool,
    size: PropTypes.number,
    withSeconds: PropTypes.bool,
    handsColor: PropTypes.string,
    secondHandColor: PropTypes.string,
    themeType: PropTypes.string,
    style: PropTypes.object,
};

export default withStyles(styles)(AnalogClock);
