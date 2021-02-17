import { Subject, fromEvent, merge } from 'rxjs';
import { mapTo, scan, filter, } from 'rxjs/operators';

// 取元素
const addButton = document.querySelector('#addButton');
const minusButton = document.querySelector('#minusButton');
const resetButton = document.querySelector('#reset');
const errorButton = document.querySelector('#error');
const completeButton = document.querySelector('#complete');
const currentState = document.querySelector('#currentState');
const evenState = document.querySelector('#evenState');

// 建立可觀察的物件(Observable)
const addClick$ = fromEvent(addButton, 'click').pipe(mapTo(1));
const minusClick$ = fromEvent(minusButton, 'click').pipe(mapTo(-1));
const resetButton$ = fromEvent(resetButton, 'click').pipe(mapTo(0));
const clickCounter$ = merge(addClick$, minusClick$, resetButton$)
  .pipe(
    scan((total, value) => {return (value === 0) ? 0 : total + value }, 0)
  );
const errorButton$ = fromEvent(errorButton, 'click');
const completeButton$ = fromEvent(completeButton, 'click');

// 建立觀察者物件(Observer)
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

// 建立主體物件(Subject)，可作為Observer及Observable
const subject = new Subject<number>();
clickCounter$.subscribe(subject);

// 建立訂閱物件(訂閱Observer，傳入Observer)
const clickSub = subject.subscribe(clickObserver);
const evenSub = subject.pipe(filter(result => result % 2 === 0))
  .subscribe(evenObserver);
const errorSub = errorButton$.subscribe(() => {
  subject.error('error!!!');
});
const completeSub = completeButton$.subscribe(() => {
  subject.complete();
});