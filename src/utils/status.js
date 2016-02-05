class Status {
  constructor(status = 'unloaded') {
    this._status = status;
  }

  set(status) {
    this._status = status;
  }

  is(status) {
    return this._status === status;
  }

}

export default Status;
