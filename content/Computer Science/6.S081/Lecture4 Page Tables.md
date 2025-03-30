#### 地址空间
1. ![](Pasted%20image%2020220829093052.png)
2. Page Table: 页表是在硬件中通过处理器和内存管理单元（Memory Management Unit）实现。
	1. 从CPU的角度来说，一旦MMU打开了，它执行的每条指令中的地址都是虚拟内存地址。
	2. 为了能够完成虚拟内存地址到物理内存地址的翻译，MMU会有一个表单，表单中，一边是虚拟内存地址，另一边是物理内存地址。
	3. 通常来说，内存地址对应关系的表单也保存在内存中。所以CPU中需要有一些寄存器用来存放表单在物理内存中的地址。(RISC-V的SATP的寄存器)
3. ![](Pasted%20image%2020220829093447.png)
4. 首先对于虚拟内存地址，我们将它划分为两个部分，index和offset，index用来查找page(4KB)，offset对应的是一个page中的哪个字节。![](Pasted%20image%2020220829094009.png)
5. 在RISC-V中，物理内存地址是56bit, 其中44bit是物理page号（PPN，Physical Page Number），剩下12bit是offset完全继承自虚拟内存地址.
6. 实际中，page table是一个多级的结构. 每个page directory都占4096Bytes, 每个page entry有64bit, 因此, 每个page directory有512个entry![](Pasted%20image%2020220829100647.png)每个Page 
#### RISC-V的硬件支持
1. MMU: 虚拟地址, 实现三级page directory的查找, 找出物理地址.
2. Translation Lookside Buffer（页表缓存）
	1. 因为本质上来说，如果你切换了page table，TLB中的缓存将不再有用，它们需要被清空，否则地址翻译可能会出错。所以操作系统知道TLB是存在的，但只会时不时的告诉CPU，现在的TLB不能用了，因为要切换page table了。在RISC-V中，清空TLB的指令是sfence_vma。

#### Kernel Page table
1. 左边是内核的虚拟地址空间，右边上半部分是物理内存或者说是DRAM，右边下半部分是I/O设备
![](Pasted%20image%2020220829104438.png)
2. 地址0x1000是boot ROM的物理地址，当你对主板上电，主板做的第一件事情就是运行存储在boot ROM中的代码，当boot完成之后，会跳转到地址0x80000000，操作系统需要确保那个地址有一些数据能够接着启动操作系统。
	1. PLIC是中断控制器（Platform-Level Interrupt Controller）
	2. CLINT（Core Local Interruptor）也是中断的一部分。所以多个设备都能产生中断，需要中断控制器来将这些中断路由到合适的处理函数。
	3. UART0（Universal Asynchronous Receiver/Transmitter）负责与Console和显示器交互。
	4. VIRTIO disk，与磁盘进行交互。

###### 进程的虚拟地址空间
![](Pasted%20image%2020220829123644.png)

> 学生提问：确认一下，低于0x80000000的物理地址，不存在于DRAM中，当我们在使用这些地址的时候，指令会直接走向其他的硬件，对吗？
> Frans教授：是的。高于0x80000000的物理地址对应DRAM芯片，但是对于例如以太网接口，也有一个特定的低于0x80000000的物理地址，我们可以对这个叫做内存映射I/O（Memory-mapped I/O）的地址执行读写指令，来完成设备的操作。

#### XV6的虚拟内存代码(不太懂)
![](Pasted%20image%2020220829145937.png)
![](Pasted%20image%2020220829152229.png)
	1. 这个函数首先设置了SATP寄存器，kernel_pagetable变量来自于kvminit第一行。所以这里实际上是内核告诉MMU来使用刚刚设置好的page table。执行完这条指令之后，程序计数器（Program Counter）增加了4。而之后的下一条指令被执行时，程序计数器会被内存中的page table翻译。
![](Pasted%20image%2020220829153019.png)


#### 提问
>学生提问：所以MMU并不会保存page table，它只会从内存中读取page table，然后完成翻译，是吗？
>Frans教授：是的，这就是你们应该记住的。page table保存在内存中，MMU只是会去查看page table，我们接下来会看到，page table比我们这里画的要稍微复杂一些。
>Frans教授：让我来问自己的一个有趣的问题，为什么是PPN存在这些page directory中？为什么不是一个虚拟内存地址？
>某学生回答：因为我们需要在物理内存中查找下一个page directory的地址。
>Frans教授：是的，我们不能让我们的地址翻译依赖于另一个翻译，否则我们可能会陷入递归的无限循环中。所以page directory必须存物理地址。那SATP呢？它存的是物理地址还是虚拟地址？
>某学生回答：还是物理地址，因为最高级的page directory还是存在物理内存中，对吧。
>Frans教授：是的，这里必须是物理地址，因为我们要用它来完成地址翻译，而不是对它进行地址翻译。所以SATP需要知道最高一级的page directory的物理地址是什么。
>学生提问：我想知道我们是怎么计算page table的物理地址，是不是这样，我们从最高级的page table得到44bit的PPN，然后再加上虚拟地址中的12bit offset，就得到了完整的56bit page table物理地址？
>Frans教授：我们不会加上虚拟地址中的offset，这里只是使用了12bit的0。**所以我们用44bit的PPN，再加上12bit的0，这样就得到了下一级page directory的56bit物理地址**. 这里要求每个page directory都与物理page对齐（也就是page directory的起始地址就是某个page的起始地址，所以低12bit都为0）

> 学生提问：3级的page table是由操作系统实现的还是由硬件自己实现的?
> Frans教授：这是由硬件实现的，所以3级 page table的查找都发生在硬件中。MMU是硬件的一部分而不是操作系统的一部分。在XV6中，有一个函数也实现了page table的查找，因为时不时的XV6也需要完成硬件的工作，所以XV6有这个叫做walk的函数，它在软件中实现了MMU硬件相同的功能。
> 学生提问：在这个机制中，TLB发生在哪一步，是在地址翻译之前还是之后？
> Frans教授：整个CPU和MMU都在处理器芯片中，所以在一个RISC-V芯片中，有多个CPU核，MMU和TLB存在于每一个CPU核里面。RISC-V处理器有L1 cache，L2 Cache，有些cache是根据物理地址索引的，有些cache是根据虚拟地址索引的，由虚拟地址索引的cache位于MMU之前，由物理地址索引的cache位于MMU之后。
> 学生提问：之前提到，硬件会完成3级 page table的查找，那为什么我们要在XV6中有一个walk函数来完成同样的工作？
> Frans教授：非常好的问题。这里有几个原因，首先XV6中的walk函数设置了最初的page table，它需要对3级page table进行编程所以它首先需要能模拟3级page table。另一个原因或许你们已经在syscall实验中遇到了，在XV6中，内核有它自己的page table，**用户进程也有自己的page table**，用户进程指向sys_info结构体的指针存在于用户空间的page table，但是内核需要将这个指针翻译成一个自己可以读写的物理地址。如果你查看copy_in，copy_out，你可以发现内核会通过用户进程的page table，将用户的虚拟地址翻译得到物理地址，这样内核可以读写相应的物理内存地址。这就是为什么在XV6中需要有walk函数的一些原因。