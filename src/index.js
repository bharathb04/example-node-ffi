const ref = require('ref');
const ffi = require('ffi');
const struct = require('ref-struct');
var sizeof = require('object-sizeof')

class User32 {

    constructor() {
        this.SM_CMONITORS = 80;

        this.HWND_BROADCAST = 0xffff;
        this.WM_SYSCOMMAND =  0x0112;
        this.SC_MONITORPOWER = 0xF170;
        this.SC_MONITORPOWER_ON = -1;
        this.SC_MONITORPOWER_OFF = 2;
        this.SC_MONITORPOWER_LOW = 1;

        var addr = ref.types.void; 
        var addrPtr = ref.refType(addr);

        /*
        var stringPtr = ref.refType(ref.types.CString);

        

        var handle = ref.types.void; 
        var hwnd = ref.refType(handle);

        var uint = ref.types.uint;
        
        

       */ 

       var lastInputInfo = struct({
        'lastInput_size': 'uint32',
        'lastInput_tick': 'uint32'
        });

        var tvl = new lastInputInfo(); 
       

        var PlastInputInfo = ref.refType(lastInputInfo);

        const user32Methods = ffi.Library('user32.dll', {
            'GetSystemMetrics': ['int', ['int']],
            'SendMessageA': ['int', ['int', 'uint', 'int', 'int']],
           
            'GetLastInputInfo': ['bool',[PlastInputInfo]],
        });

        const sysInfo = ffi.Library('kernel32.dll', {
            'GetTickCount': ['ulong',[]],
        });

        Object.assign(this, user32Methods);
        Object.assign(this, sysInfo);

        tvl.lastInput_tick = 0;
        tvl.lastInput_size = sizeof(tvl);
        
        console.log('tick count::', tvl.lastInput_tick,tvl.lastInput_size,tvl.ref());

        
        console.log('tim:', this.GetLastInputInfo(tvl.ref()));
        console.log('tick count::', tvl.lastInput_tick,tvl.lastInput_size);

    }

    countMonitors() {
        return this.GetSystemMetrics(this.SM_CMONITORS);
    }

    SleepMonitor() {
        return this.SendMessageA(this.HWND_BROADCAST,this.WM_SYSCOMMAND,this.SC_MONITORPOWER,this.SC_MONITORPOWER_OFF);
    }
 
    getTickCount() {
        
       return this.GetTickCount();

   }
  
}

const u32 = new User32();

      
console.log('The number of monitors is', u32.countMonitors());
console.log('sleep  monitor ', u32.SleepMonitor());
//console.log('return values: ' + u32.SendMessage(u32.GetForegroundWindow,u32.RegisterWindowMessageA(lstr),0,0));
//console.log('Window message:', u32.SendMessage(fwin,rwin,0,0));
console.log('get tick count::', u32.getTickCount());


