import './styles.scss';

class CountdownTimer {
  constructor({ selector, targetDate }) {
    this.selector = selector;
    this.endTime = targetDate;
    this.intervalId = null;
    this.timerRef = null;
  }

  init() {
    this.timerRef = document.getElementById(this.selector);
    this.timerRef.classList.add('timer');
    this.timerRef.innerHTML = makeMarkup(this.getTime(0), false);
  }

  start() {
    let startTime =
      this.endTime - Date.now() > 0 ? this.endTime - Date.now() : 0;
    if (!startTime) {
      this.stop();
      return;
    }
    this.timerRef.innerHTML = makeMarkup(this.getTime(startTime), false);

    this.intervalId = setInterval(() => {
      const {
        days: lastDays,
        hours: lastHours,
        mins: lastMins,
        secs: lastSecs,
      } = this.getTime(startTime);

      const nowTime = this.endTime - Date.now();
      if (!nowTime) {
        this.stop(); // Закончил считать!
        return;
      }

      const {
        days: nowDays,
        hours: nowHours,
        mins: nowMins,
        secs: nowSecs,
      } = this.getTime(nowTime);

      startTime = nowTime;

      updateTime(this.selector, 'secs', lastSecs, nowSecs);
      updateTime(this.selector, 'mins', lastMins, nowMins);
      updateTime(this.selector, 'hours', lastHours, nowHours);
      if (nowDays.length < lastDays.length) {
        this.timerRef.innerHTML = makeMarkup(this.getTime(nowTime), true);
      } else {
        updateTime(this.selector, 'days', lastDays, nowDays);
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  getTime(time) {
    const days = this._pad(Math.floor(time / (1000 * 60 * 60 * 24)));
    const hours = this._pad(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    );
    const mins = this._pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this._pad(Math.floor((time % (1000 * 60)) / 1000));
    return { days, hours, mins, secs };
  }

  _pad(value) {
    return String(value).padStart(2, '0');
  }
}

const timerOne = new CountdownTimer({
  selector: 'timer-1',
  // targetDate: new Date('Nov 30, 2020'),
  targetDate: Date.now() + 8.64e9 + 10000,
  // targetDate: new Date('Nov 30, 2018'),
});

timerOne.init();
timerOne.start();

// setTimeout(() => {
//   timerOne.stop();
// }, 15000);

const timerTwo = new CountdownTimer({
  selector: 'timer-2',
  targetDate: new Date('Jan 1, 2021'),
  // targetDate: Date.now() + 8.64e9 + 10000,
});

timerTwo.init();
timerTwo.start();

function makeMarkup(time, isDaysRankDown) {
  const lastView = isDaysRankDown ? '0' : '-';
  let code = '';

  for (const intervalName in time) {
    let desc = '';
    if (intervalName === 'days') desc = 'Дней';
    else if (intervalName === 'hours') desc = 'Часов';
    else if (intervalName === 'mins') desc = 'Минут';
    else if (intervalName === 'secs') desc = 'Секунд';
    else desc = 'Х..й знает чего';
    if (time.hasOwnProperty(intervalName)) {
      code += `<div class="field">
      <div class="field__second field__second__${intervalName}">`;

      time[intervalName].split('').forEach((item, i) => {
        code += `<div class="field__digit field__digit_${i}">
        <div class="field__digit_last_placeholder">
          <div class="field__digit_last_placeholder_inner">${lastView}</div>
          </div>
          <div class="field__digit_new_placeholder">${item}</div>
          <div class="field__digit_last_rotate">${lastView}</div>
          <div class="field__digit_new_rotate">
          <div class="field__digit_new_rotated">
        <div class="field__digit_new_rotated_inner">${item}</div>
        </div>
        </div>
        </div>`;
      });
      code += `</div><div class="field__description">${desc}</div></div>`;
    }
  }
  return code;
}

function updateTime(id, timeType, last, now) {
  for (let i = 0; i < last.length; i += 1) {
    const delta = now[i] - last[i];
    if (delta) {
      const digitRef = document.querySelector(
        `#${id} > .field .field__second__${timeType} .field__digit_${i}`,
      );
      updateMarkup(digitRef, last[i], now[i]);
    }
  }
}

function updateMarkup(ref, last, now) {
  ref.innerHTML = `<div class="field__digit_last_placeholder">
          <div class="field__digit_last_placeholder_inner">${last}</div>
          </div>
          <div class="field__digit_new_placeholder">${now}</div>
          <div class="field__digit_last_rotate">${last}</div>
          <div class="field__digit_new_rotate">
          <div class="field__digit_new_rotated">
        <div class="field__digit_new_rotated_inner">${now}</div>
        </div>
        </div>`;
}
