import { Subject, fromEvent, merge } from 'rxjs';
import { mapTo, scan, filter, } from 'rxjs/operators';

// 【取元素】
// 按鈕元素
const startButton = document.querySelector('#start');
const addButton = document.querySelector('#addButton');
const minusButton = document.querySelector('#minusButton');
const resetButton = document.querySelector('#reset');
const errorButton = document.querySelector('#error');
const completeButton = document.querySelector('#complete');
// 內容元素
const currentState = document.querySelector('#currentState');
const evenState = document.querySelector('#evenState');

// 取按鈕屬性
let addBtnEle = addButton as HTMLButtonElement;
let minusBtnEle = minusButton as HTMLButtonElement;
let resetBtnEle = resetButton as HTMLButtonElement;
let errtnEle = errorButton as HTMLButtonElement;
let completeBtnEle = completeButton as HTMLButtonElement;
let startedList:HTMLButtonElement[] =[resetBtnEle, addBtnEle, minusBtnEle, errtnEle, completeBtnEle]
let startBtnEle = startButton as HTMLButtonElement;

// 【建立可觀察的物件(Observable)】
// 開始按鈕
const startButton$ = fromEvent(startButton, 'click')
// 增、減、歸零按鈕
const addClick$ = fromEvent(addButton, 'click').pipe(mapTo(1));
const minusClick$ = fromEvent(minusButton, 'click').pipe(mapTo(-1));
const resetButton$ = fromEvent(resetButton, 'click').pipe(mapTo(0));
// 增、減、歸零按鈕結果合併
const clickCounter$ = merge(addClick$, minusClick$, resetButton$)
  .pipe(
    scan((total, value) => {return (value === 0) ? 0 : total + value }, 0)
  );
// 錯誤、完成按鈕
const errorButton$ = fromEvent(errorButton, 'click');
const completeButton$ = fromEvent(completeButton, 'click');

// 【建立觀察者物件(Observer)】
// 全部計數
const clickObserver = {
  next: (result) => {
    currentState.innerHTML = `${result}`;
  },
  error: (err) => { 
    currentState.innerHTML = `err: ${err}`;
  },
  complete: () => {
    currentState.innerHTML = 'complete';
  }
}
// 偶數計數
const evenObserver = {
  next: (result) => {
    evenState.innerHTML = `${result}`;
  },
  error: (err) => { 
    evenState.innerHTML = `err: ${err}`;
  },
  complete: () => {
    evenState.innerHTML = 'complete';
  }
}

// 【建立主體物件(Subject)，可作為Observer及Observable】
// 按start按鈕開啟一新計數器
startButton$.subscribe(() => {
  // 按start按鈕後才可進行其他按鈕動作
  startedList.forEach( item => item.disabled = false);
  startBtnEle.disabled = true;
  // 若按下add、minus或reset按鈕，用以通知計數器值改變
  let subject = new Subject<number>();
  clickCounter$.subscribe(subject);

  // 計數器值改變，進行全部計數、偶數計數呈現
  subject.subscribe(clickObserver);
  subject.pipe(filter(result => result % 2 === 0))
  .subscribe(evenObserver);
  
  // 若按下error按鈕
  errorButton$.subscribe(() => {
    subject.error('error');
    startedList.forEach( item => item.disabled = true)
    startBtnEle.disabled = false;
  });

  // 若按下complete按鈕
  completeButton$.subscribe(() => {
    subject.complete();
    startedList.forEach( item => item.disabled = true)
    startBtnEle.disabled = false;
  });

  // 送出計數器預設值0
  subject.next(0);
});
