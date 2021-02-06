import { fromEvent, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// 取元素
const startButton = document.querySelector('#start');
const countButton = document.querySelector('#count');
const errorButton = document.querySelector('#error');
const completeButton = document.querySelector('#complete');

// 目前狀態
const statusLabel = document.querySelector('#status');
// 目前計數
const currentCounterLabel = document.querySelector('#currentCounter');
// 偶數計數
const evenCounterLabel = document.querySelector('#evenCounter');


// 計數器起始值
let counter = 0;
// 訂定subject(多個通知對象)，通知計數器值改變
let counter$: Subject<number>;

// 「開始新的計數器」按鈕事件訂閱
fromEvent(startButton, 'click').subscribe(() => {
  counter$ = new Subject();
  counter = 0;

  statusLabel.innerHTML = '目前狀態：開始計數';

  counter$.subscribe(data => {
    currentCounterLabel.innerHTML = `目前計數：${data}`;
  });

  const evenCounter$ = counter$.pipe(filter(data => data % 2 === 0));
  evenCounter$.subscribe(data => {
    evenCounterLabel.innerHTML = `偶數計數：${data}`;
  });

  // 處理「顯示狀態」邏輯
  counter$.subscribe({
    error: message => {
      statusLabel.innerHTML = `目前狀態：錯誤 -> ${message}`;
    },
    complete: () => {
      statusLabel.innerHTML = '目前狀態：完成';
    }
  });

  // 一開始就送出預設值
  counter$.next(counter);
});

// 「計數」按鈕事件訂閱
fromEvent(countButton, 'click').subscribe(() => {
  counter$.next(++counter);
});

// 「錯誤」按鈕事件訂閱
fromEvent(errorButton, 'click').subscribe(() => {
  const reason = prompt('請輸入錯誤訊息');
  counter$.error(reason || 'error');
});

// 「完成」按鈕事件訂閱
fromEvent(completeButton, 'click').subscribe(() => {
  counter$.complete();
});
