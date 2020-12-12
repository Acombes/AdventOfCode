class ComplexNumber {
  static I = new ComplexNumber(0, 1);

  constructor(real = 0, imaginary = 0) {
    this.real = real;
    this.imaginary = imaginary;
  }

  toString() {
    if (this.real === 0) {
      return `${this.imaginary}i`;
    }
    if (this.imaginary === 0) {
      return this.real.toString();
    }
    return `${this.real}+${this.imaginary}i`;
  }

  plus (number) {
    let complex = number;
    if (typeof number === 'number') {
      complex = new ComplexNumber(number)
    }
    return new ComplexNumber(this.real + complex.real, this.imaginary + complex.imaginary);
  }

  minus (number) {
    let complex = number;
    if (typeof number === 'number') {
      complex = new ComplexNumber(number)
    }
    return new ComplexNumber(this.real - complex.real, this.imaginary - complex.imaginary);
  }

  times(number) {
    let complex = number;
    if (typeof number === 'number') {
      complex = new ComplexNumber(number)
    }

    return new ComplexNumber(this.real * complex.real - this.imaginary * complex.imaginary, this.real * complex.imaginary + this.imaginary * complex.real);
  }

  dividedBy (number) {
    let complex = number;
    if (typeof number === 'number') {
      complex = new ComplexNumber(number)
    }

    return new ComplexNumber(
      (this.real * complex.real + this.imaginary * complex.imaginary) / (Math.pow(complex.real, 2) + Math.pow(complex.imaginary, 2)),
      (this.imaginary * complex.real - this.real * complex.imaginary) / (Math.pow(complex.real, 2) + Math.pow(complex.imaginary, 2))
    )
  }

  pow (number) {
    if (this === ComplexNumber.I) {
      switch((number - Math.trunc(number / 4) * 4 + 4) % 4) {
        case 0:
          return new ComplexNumber(1);
        case 1:
          return ComplexNumber.I;
        case 2:
          return new ComplexNumber(-1);
        case 3:
          return new ComplexNumber(0, -1);
      }
    }
    const pow = new Array(Math.abs(number)).fill(number).reduce(result => result.times(number))
    if (number >= 0) {
      return pow;
    }
    return new ComplexNumber(1).dividedBy(pow);
  }

  taxiCab () {
    return Math.abs(this.real) + Math.abs(this.imaginary);
  }
}

module.exports = ComplexNumber;
