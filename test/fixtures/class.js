class MyClass extends SuperClass {
    constructor(a) {
        super();
        this.a = a;
    }
    get b() {
        return this.a;
    }
    set b(_b) {
        this.a = _b;
    }
    c(d, e) {
        d = e;
        return super(d);
    }
}

var OtherClass = class OtherClass_ extends MyClass {
    constructor(a, f) {
        super(a);
        this.f = f;
    }
}
OtherClass_;
this;
