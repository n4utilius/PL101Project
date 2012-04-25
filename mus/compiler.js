
/* 1 -
	Write a function prelude that takes a music expression expr as
	input and returns an expression that means to play a d4 note for 
	500 milliseconds and then play expr.

  var prelude = function(expr) {
    return { tag: 'seq',
             left: { tag: 'note', pitch: 'd4', dur: 500 },
             right: expr };
  };

*/

/* 2 -
	This time write a function reverse that takes a music expression 
	as input and returns a new music expression that plays the notes 
	in the reverse order. Your function shouldn't modify the input, 
	it should just return a new reversed expression.


  var reverse = function(expr) {
    var rev_expr ={};
    if(expr.tag === 'seq'){
      rev_expr.tag = 'seq';
      rev_expr.left = reverse(expr.right); 
      rev_expr.right = reverse(expr.left); 
    } else rev_expr = expr;
    return rev_expr;
  };

*/

/* 3 -
  Write a function endTime that takes a start time time in milliseconds
  and a MUS expression expr. Assuming expr starts playing at time time,
  the function should return the time when expr finishes.


  var endTime = function (time, expr) {
      var add=0;
      
      var f = function(e){
        if(e){
            if(e.tag === 'note') add += e.dur;
            f(e.left);f(e.right);
        }
      };
      
      f(expr);
      return(time + add);
  };

*/

/* 4 -
   Write a function compile that compiles MUS songs into NOTE songs. 

    var compile = function (musexpr) {
      var note_expr = [], time_start = 0;
        
      var compileT = function(expr){
         if(expr.tag === 'note'){
           var note = {tag : expr.tag,
                       pitch : expr.pitch,
                       start: time_start,
                       dur : expr.dur};
           
           note_expr.push(note);
           time_start += expr.dur; 
               
         }else if(expr.tag === 'seq'){
           compileT(expr.left);
           compileT(expr.right);
         }
      };
      compileT(musexpr);
      return note_expr;
    };
*/

              /*-------------------0------------------
              var compile = function (musexpr) {
                var note_expr = [], time_start = 0;
                  
                var compileT = function(expr){
                    switch( expr.tag ){ 
                    case 'note': 
                      var note = {tag : expr.tag,
                                 pitch : expr.pitch,
                                 start: time_start,
                                 dur : expr.dur};
                     
                      note_expr.push(note);
                      time_start += expr.dur; 
                      break; 
                          
                    case 'seq': 
                      compileT(expr.left);
                      compileT(expr.right);
                      break;    
                  } 
                };
                compileT(musexpr);
                return note_expr;
              };
              */

/* 5 -
  
*/

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