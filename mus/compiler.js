var compile = function (musexpr) {
  var note_expr = [], time_start = 0;
  var notes_cor = { "c":0, "d":2, "e":4, "f":5, "g":7, "a":9,"b":11 }
    
  var compileT = function(expr, time){
    var duration=0;

    if( expr.tag ==='rest' ){ 
        var rest = {tag : expr.tag,
                    start: time,
                    dur : expr.dur};
       
        note_expr.push(rest);
        duration = expr.dur; 
    }

    if( expr.tag ==='note' ){ 
        var note = {tag : expr.tag,
                    pitch : convertPitch(expr.pitch),
                    start: time,
                    dur : expr.dur};
       
        note_expr.push(note);
        duration = expr.dur; 
    }
            
    if( expr.tag ==='seq'){  
        time += duration;
        compileT(expr.left, time);
        time += duration;
        compileT(expr.right, time);
    }
      
    if( expr.tag ==='par' ){ 
        compileT(expr.left, time);   var ldur = duration;
        compileT(expr.right, time);  var rdur = duration;
        duration =(ldur > rdur)? ldur: rdur;
        time += duration;
    } 
     
    if( expr.tag ==='repeat'){
        if(expr.count > 0 ){
          for (var i=0; i < expr.count; i++){
            compileT(expr.section, time);
          }
        }
    }
      
  };

  var convertPitch = function(pitch){
    var pitch_array = pitch.split("");

    var letter = pitch_array[0];
    var octave = pitch_array[1];

    var letter_to_number = notes_cor[letter];

    var number = 12 +(12 * octave) + letter_to_number;
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
/*
{ tag: 'seq',
      left: 
       { tag: 'par',
         left: { tag: 'note', pitch: 'c3', dur: 250 },
         right: { tag: 'note', pitch: 'g4', dur: 500 } },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'd3', dur: 500 },
         right: { tag: 'note', pitch: 'f4', dur: 250 } } };
*/
/*
{ tag: 'par',
  left: { tag: 'note', pitch: 'c4', dur: 250 },
  right:
   { tag: 'par',
     left: { tag: 'note', pitch: 'e4', dur: 250 },
     right: { tag: 'note', pitch: 'g4', dur: 250 } } }
*/
/*
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } }; 
*/
/*
  { tag: 'rest', duration: 100 }
*/
/*
  { tag: 'repeat',
  section: { tag: 'note', pitch: 'c4', dur: 250 },
  count: 3 }
*/
console.log(melody_mus);
console.log("-------------------------------------");
console.log(compile(melody_mus));