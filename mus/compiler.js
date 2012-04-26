var compile = function (musexpr) {
  var note_expr = [], note = {}, time_start = 0, 
      note_value = { "c":0, "d":2, "e":4, "f":5, "g":7, "a":9,"b":11 };
    
  var compileT = function(expr, time){
    var duration=0;
    if( expr.tag ==='rest' ){ 
        var rest = { tag : expr.tag, 
                     start: time, 
                     dur : expr.dur };

        note_expr.push(rest);
        duration = expr.dur; 
    }else

    if( expr.tag ==='note' ){ 
        var note = { tag : expr.tag, 
                     pitch : convertPitch(expr.pitch),
                     start: time, 
                     dur : expr.dur };

        note_expr.push(note);
        duration = expr.dur; 
    }else
            
    if( expr.tag ==='seq'){  
        time += duration;
        compileT(expr.left, time);
        time += duration;
        compileT(expr.right, time);
    }else
      
    if( expr.tag ==='par' ){ 
        compileT(expr.left, time);   var ldur = duration;
        compileT(expr.right, time);  var rdur = duration;
        duration =(ldur > rdur)? ldur: rdur;
        time += duration;
    } else
     
    if( expr.tag ==='repeat'){
        if(expr.count > 0 ){
          for (var i=0; i < expr.count; i++){
            compileT(expr.section, time);
          }
        }
    } 
  };

  var convertPitch = function(pitch){
    var pitch = pitch.split("");
    var number = 12 +(12 * pitch[1]) + note_value[pitch[0]];
    return number;
  }
  compileT(musexpr,time_start);
  return note_expr;
};

var melody_mus = { tag: 'repeat',
  section: { tag: 'seq',
             left: { tag: 'note', pitch: 'a4', dur: 250 },
             right: { tag: 'note', pitch: 'b4', dur: 250 } 
           },
  count: 3 }

console.log(melody_mus);
console.log("-------------------------------------");
console.log(compile(melody_mus));