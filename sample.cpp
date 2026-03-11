#include <cstdlib>
#include <map>
using namespace std;

typedef long long unsigned int llui;
typedef long long int lli;
typedef long double ld;

llui _mm(llui a, llui b, llui m){
   llui y = (llui)((ld)a*(ld)b/m+(ld)1/2);
   y = y * m;
   llui x = a * b;
   llui r = x - y;
   if ( (lli)r < 0 ){
      r = r + m; y = y - 1;
   }
   return r;
}

llui _C,_a,_b;
llui _g(){
   llui c;
   if(_a>_b){
      c = _a; _a = _b; _b = c;
   }
   while(1){
      if(_a == 1LL) return 1LL;
      if(_a == 0 || _a == _b) return _b;
      c = _a; _a = _b%_a;
      _b = c;
   }
}

llui _f(llui a, llui b){
   llui t;
   t = _mm(a,a,b);
   t+=_C; t%=b;
   return t;
}

llui _rho(llui n){
   if(!(n&1)) return 2;
   _C=0;
   llui _i = 0;
   while(_i <= 1000){
      llui x,y,d;
      x = y = 2; d = 1;
      while(d == 1){
          x = _f(x,n);
          y = _f(_f(y,n),n);
          llui m = (x>y)?(x-y):(y-x);
          _a = m; _b = n; d = _g();
      }
      if(d != n)
          return d;
      _i++; _C = rand();
   }
   return 1;
}

llui _pw(llui a, llui b, llui c){
   if(b == 0) return 1;
   if(b == 1) return a%c;
   llui r = _pw(a,b>>1,c);
   r = _mm(r,r,c);
   if(b&1)
      r = _mm(r,a,c);
   return r;
}

bool _chk(llui n){
   llui d = n-1;
   llui s = 0;
   if(n <=3 || n == 5) return true;
   if(!(n&1)) return false;
   while(!(d&1)){ s++; d>>=1; }
   for(llui i = 0;i<32;i++){
      llui a = rand();
      a <<=32;
      a+=rand();
      a%=(n-3); a+=2;
      llui x = _pw(a,d,n);
      if(x == 1 || x == n-1) continue;
      for(llui j = 1;j<= s-1;j++){
         x = _mm(x,x,n);
         if(x == 1) return false;
         if(x == n-1)break;
      }
      if(x != n-1) return false;
   }
   return true;
}

map<llui,int> _res;
void _proc(llui n){
   if(!_chk(n)){
      llui f = _rho(n);
      _proc(n/f); _proc(f);
   }else{
      map<llui,int>::iterator it;
      it = _res.find(n);
      if(it != _res.end()){
         (*it).second++;
      }else{
         _res[n] = 1;
      }
   }
}
