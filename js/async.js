// var AsyncTest = function(collector, cb) {
//   var _this = this;
//   this.cb = cb;
//   this.webglTestNum = 1;
//   this.collector = collector;
//   this.testList = [];
//   this.testList.push(new MoreLight());
//   this.numTestsComplete = 0;
//   this.testFinished = function(ID, value) {
//     _this.collector.checkExsitPicture(value, ID);
//     var img_hash = calcSHA1(value);
//     res = {};
//     res[ID] = img_hash;
//     if (++ _this.numTestsComplete >= _this.testList.length) {
//       // cause all ++ is done in main js thread, there should be no 
//       // mul-thread problem
//       _this.allFinished(res);
//     }
//   }

//   // start test here
//   this.begin = function() {
//     for (var test in this.testList) {
//       this.testList[test].begin(this.testFinished, collector.getID());
//     }
//   }

//   this.allFinished = function(res) {
//     var res_str = "";
//     for (var key in res) {
//       res_str += key + '_' + res[key];
//     }
//     ret = {};
//     ret['gpuimgs'] = res_str;
//     collector.asyncFinished(ret);
//   }
// }

var AsyncTest = function(collector, cb) {
  var _this = this;
  this.cb = cb;
  this.webglTestNum = 1;
  this.collector = collector;
  this.testList = [];
  this.testList.push(new MoreLight());
  this.numTestsComplete = 0;

  this.testFinished = function(ID, value) {
    _this.collector.checkExsitPicture(value, ID);
    var img_hash = calcSHA1(value);
    res = {};
    res[ID] = img_hash;
    if (++_this.numTestsComplete >= _this.testList.length) {
      _this.allFinished(res);
    }
  };

  this.begin = function() {
    var promises = this.testList.map(test => new Promise((resolve) => {
      test.begin((ID, value) => {
        _this.testFinished(ID, value);
        resolve();
      }, collector.getID());
    }));

    Promise.all(promises).then(() => {
      if (_this.numTestsComplete >= _this.testList.length) {
        _this.allFinished(res);
      }
    });
  };

  this.allFinished = function(res) {
    var res_str = "";
    for (var key in res) {
      res_str += key + '_' + res[key];
    }
    ret = {};
    ret['gpuimgs'] = res_str;
    collector.asyncFinished(ret);
  };
};