---
title: pintos system
top: false
cover: false
toc: true
mathjax: true
date: 2021-09-12 09:34:41
password:
description: Pintos教学系统的文档注释
tags:
- Pintos
- CS162
categories:
- Operating System
---

## Pintos系统简介
1. Proj0:
   1. 编译和运行所有Proj1的测试: 在`userprog`目录下`make`和`make check`.
      1. 运行单个测试: `pintos-test stack-align-0`
      2. 运行单个debug测试: `PINTOS_DEBUG=1 pintos-test stack-align-0`, 然后输入`debugpintos`以连接Pintos process
      3. debug page faults: 在前面加上`FORCE_SIMULATOR=--bochs`
         1. 但kernel遇到page faults时, `set $eip = ((void**) $esp)[1]`,`up`,`down`来检查本地变量和stack trace.
<!-- more -->
      1. debug kernel panic: `backtrace kernel.o 0xc0106eff 0xc01102fb 0xc010dc22 0xc010cf67 0xc0102319 ...`
   2. 输出结果在`proj-intro/src/userprog/build/tests/userprog/do-nothing.result`中</br></br>
3. `src/`下的目录简介:
   1. `threads/`: Pintos内核基础, 包括bootloader, kernel entrypoint, base interrupt handler, page allocator, subpage memory allocator, and CPU scheduler.
      - `thread.h`: 包含`struct thread`(TCB)的定义, `#ifdef USERPROG ... #endif`中共同定义了PCB.
      - `start.S`: Contains assembly code that Pintos bootloader jumps to. This is the **first kernel code** that starts executing.
      - `init.c`: 在`start.S`中的内核码进行一些基本设置之后, 然后跳转到`init.c`的`int main(void)`(C语言), 进行更多的设置, 然后执行Pintos要求的任务.(比如运行一个测试或者用户程序)
      - `intr-stub.S`: Code for saving registers and executing an interrupt handler. 相应的中断stack frame structure 被定义在 `interrupt.h`.
      - `switch.S`: Code for saving registers on a context switch between two kernel threads.
   2. `userprog/`: 用户程序支持目录, 包括page/segment tables, handlers for system calls, page faults, and other traps.
      - `build/Makefile`: `Makefile.build`的副本
      - `build/kernel.o`: 整个内核的Object file, 包含debug信息
      - `build/kernel.bin`: 整个内核的内存镜像文件, 不包括debug信息
      - `build/loader.bin`: kernel loader的内存镜像, 用汇编写的, 主要功能是将kernel加载进内存中并启动. </br></br>
      - `process.h`: 包含`struct process`(PCB)的定义
      - `process.c`: `process.h`的实现, 还包括如何加载ELF binaries, 开始进程, context switch时切换page tables
      - `pagedir.c`: manage page tables
      - `exception.h`: 处理异常
      - `syscall.c`: This is a skeleton system call handler.
   3. `vm/`: ......
   4. `filesys/`: Pintos文件系统
      - 阅读`filesys.h` and `file.h`以理解如何使用文件系统 
   5. `devices/`: I/O设备接口的源代码
   6. `lib/`: C标准库的子集实现代码
      - `lib/kernel/`: 仅Kernel使用的库函数, 包含一些数据类型实现, 如bitmaps, doubly linked list, and hash tables.
      - `lib/user/`: 仅用户程序使用的库函数</br></br>
      - `syscall.c`: system call handler
      - `lib/user/syscall.c`: 为C语言用户程序提供库函数, 以进行system call.
      - `syscall-nr.h`: 为每一个系统调用定义个syscall number.
      - `float.h`: 管理FPU硬件
   7. `test/`: 每个Project使用的测试代码
   8. `Examples/`: 用户程序例子
   9. `Makefile.build`: 描述如何构造系统
   10. `gdt.c`: Global Descriptor Table描述正在使用的segments
   11. `tss.c`: 管理Task-State Segment(TSS), 用于在80x86架构中实现人物切换

4. 增加源文件: 将测试放入`tests/userprog/`, 然后编辑`tests/userprog/Make.tests`

## 虚拟内存layout

1. 用户虚拟内存从0至PHYS_BASE(默认3GB), 定义在`threads/vaddr.h`, 内核内存空间从PHYS_BASE至4GB.
2. 但进程切换时会切换虚拟地址空间, by change processor's page directory base register(在`userprog/pagedir.c`的pagedir_activate()中), `struct thread`包含一个指向进程页表的指针.
3. 一个进程如果访问内核的虚拟内存, 会造成page fault, 此错误由`userprog/exception.c的page_fault.c`来处理. 同时, 如果内核访问一个没有虚拟内存映射的内存地址时, 也会造成page fault.
   1. 检查指针的有效性, 然后dereference it.
   2. 仅确保指针小于PHYS_BASE, 然后dereference. 无效的指针再造成page fault.
      - 以上两种方案都需要确保不会leak resource, 比如释放锁和free malloced page.

## 切换线程

1. 显示当前的线程id: `call thread_current()->id`
2. 显示同时存在与pintos中的其他线程: `dumplist &all_list thread allelem`

## 80x86调用约定

1. 将参数从右到左依次入stack
2. 将return address推入stack, 然后jump to callee
3. 调用callee, 按照约定取得参数, 返回值存入eax中
4. 返回时, 弹出return address, jump to return address
5. caller再弹出所有参数

## 程序启动

1. Pintos为用户程序在`lib/user/entry.c`中设计了`_start()`函数, 作为用户程序的入口点. 该函数时一个包装函数, 在main()返回后调用exit().
2. kernel为为`_start()`准备好参数

## 增加测试

1. 

## 线程

1. 线程切换的具体实现在`threads/switch.S`中, 一个线程调用`switch_threads()`来切换到另一个线程, 新线程所做的第一件事, 就是从`switch_threads()`中返回
2. The thread struct
   1. 每个线程在内核中拥有4KB大小的内存页. 用于线程的内核stack和thread struct.
   2. 每个thread struct代表一个内核线程或用户进程(???), 大小仅a few bytes, 处在内存页的起始位置, 剩下的内存页则用于thread stack.

3. struct thread成员
   1. `tid_t tid`: thread thread's identifier
   2. `enum thread_status status`: `THREAD_RUNNING`运行中, `THREAD_READY` ready to run, `THREAD_BLOCKED` waiting for something, `THREAD_DYING`线程已经exit, 等待被破坏.
   3. `char name[16]`: 线程的名字
   4. `uint8_t *stack`: 用于在切换线程时, 保存stack pointer; 其他的register保存在stack中.
   5. `int priority`: 线程的优先级, 从PRI_MIN(0) 至 PRI_MAX(63); 0的优先级最低.
   6. `struct list_elem allelem`: 包含所有线程的list
   7. `struct list_elem elem`: 将线程放入双向链表中, 要么是read_list, 要么是等待semaphore的list.
   8. `uint32_t pagedir`: 进程的页表
   9. `unsigned magic`: 被设置为`THREAD_MAGIC`, stack overflow会改变this value, `check_current()`会检测它.

4. 线程函数:
   1. `void thread_init(void)`: 创建一个`struct thread`, 用于pintos初始化线程
   2. `struct thread *thread_current (void)`: 返回运行中的线程
   3. `void thread_exit (void) NO_RETURN`: 让当前线程exit, 且不返回.

## 进程

1. 每个进程都有一个PCB，管理着进程运行时所需的所有信息；每个线程也拥有自己的TCB，包括name, priority, stack pointer。内核也将每个用户线程和一个内核线程关联起来，用于处理线程的特权操作。
2. 在Pintos中，线程的TCB与stack在同一个page中，TCB处在page的底部；而进程没有stack，所以只能使用malloc，将PCB存储在进程的heap中；线程通过指针来访问它。PCB定义在`userprog/process.c`中

### 进程详解

1. **First user program:** 所有的用户程序都来源于已有的用户程序执行`exec` syscall，但第一个用户程序来自哪里呢？ 当系统启动时，它首先运行`threads/init.c`，如果用户想运行用户程序，`run_task`函数会被调用，它使pintos的主线程调用`process_wait(process_execute(task))。所以第一个用户程序是OS的主线程创建的。
2. 区分OS的主线程和用户程序的主线程：
   1. OS的主线程是运行`threads/init.c`的线程，这个线程会设置好OS，并开始运行第一个任务（kernel task or user program）。
   2. 而用户的主线程，是用户进程被创建时的那个线程。
   3. 因为首个用户程序是被OS的主线程创建的，则OS主线程也必须有一个PCB。所以在`userprog/process.c`的`userprog_init`函数中给予了OS主线程a minimal PCB。

3. PID and TID
   1. In the starter code, 定义了一个进程的PID为主线程的TID
   2. 相关函数:`bool is_main_thread(struct thread* t, struct process* p)` and `pid_t get_pid(struct process* p)`  
4. The Process Struct
   ```
   /* The process control block for a given process. Since
   there can be multiple threads per process, we need a separate
   PCB from the TCB. All TCBs in a process will have a pointer
   to the PCB, and the PCB will have a pointer to the main thread
   of the process, which is `special`. */
   struct process {
   /* Owned by process.c. */
   uint32_t* pagedir; /* Page directory. */
   char process_name[16]; /* Name of the main thread */
   struct thread* main_thread; /* Pointer to main thread */
   };
   ```

## Synchronization Primitives

1. Disabling Interrupts
   1. Types and functions for disabling and enabling interrupts are in `threads/interrupt.h.`
      - Type: `enum intr_level`: `INTR_OFF` and `INTR_ON`
      - `enum intr_level intr_get_level(void)`: 返回当前中断状态
      - `enum intr_level intr_set_level (enum intr_level level)`: 根据`level`打开或者关闭中断, 返回以前的中断状态
      - `enum intr_level intr_enable (void)`: enable interrupt
      - `enum intr_level intr_disable (void)`: disable interrupt

2. Semaphore
   1. Pintos' semaphore type and operations are declared in `threads/synch.h`
      - Type: `struct semaphore`
      - `void sema_init (struct semaphore *sema, unsigned value)`: 初始化
      - `void sema_down (struct semaphore *sema)`: 等待值变正, 并减一
      - `bool sema_try_down (struct semaphore *sema)`: 尝试减一, 成功则返回true, 失败则返回法绿色, 不等待
      - void sema_up (struct semaphore *sema): 值加一, 如果有等待线程, 则唤醒

3. Lock
   1. 相比于semaphore: 只有持有该锁的线程才能release it.
   2. Lock types and functions are declared in `threads/synch.h`
      - Type: `struct lock`
      - `void lock_init (struct lock *lock)`: 初始化
      - `void lock_acquire (struct lock *lock)`: 为当前线程获取锁, 或等待其他线程释放锁
      - `bool lock_try_acquire (struct lock *lock)`: 尝试获取锁, 不等待
      - `void lock_release (struct lock *lock)`: 释放锁
      - `bool lock_held_by_current_thread (const struct lock *lock)`

4. Monitors: Lock + Conditional Variables
   1. Condition variable typ es and functions are declared in `threads/synch.h`
      - Type: `struct condition`
      - `void cond_init (struct condition *cond)`: 初始化
      - `void cond_wait (struct condition *cond, struct lock *lock)`: 自动释放锁, 并等待signal; 其他线程发出signal之后, 该线程重新获取锁, 并再次检查CV
      - `void cond_signal (struct condition *cond, struct lock *lock)`: 发出signal, 唤醒等待线程
      - `void cond_broadcast (struct condition *cond, struct lock *lock)`: wake up all threads.

## Optimization Barriers

1. 阻止编译器对内存状态做出假设, The compiler will not reorder reads or writes of variables
across the barrier or assume that a variable's value is unmodified across the barrier.
2. 定义: In Pintos, `threads/synch.h` defines the `barrier()` macro as an optimization barrier.
3. 使用场景:
   1. when data can change asynchronously
   2. 避免编译器优化
   3. 用于顺序的内存读写

## 内存分配

1. Pintos包括两种内存分配器, 一种以page为单位, 另一种则可以分配任何大小的block

### Page Allocator

1. 声明位置为`threads/palloc.h`
2. 默认情况下, the page allocator将内存分为kernel pool和user pool; 默认情况下, 每个pool得到系统内存的一半, 大约有1MiB; user pool用于给用户的进程分配内存, kernel pool用于其他所有分配.
3. 每个pool都有一个bitmap来追踪其使用, one bit per page. False bit代表该page未使用, true bit代表已使用.
4. Pages在中断环境中不会被allcaoted, 但可以free; 当page is freed, its all bytes都被设置为0xcc
   1. `void * palloc_get_page (enum palloc_flags flags)` 和 `void * palloc_get_multiple (enum palloc_flags flags, size_t page_cnt)`: 分配page, 失败则返回null pointer.
      - Page Allocator Flag: `PAL_ASSERT`: If the pages cannot b e allo cated, panic the kernel.
      - Page Allocator Flag: `PAL_ZERO`: 在return前, zero all the bytes in the allocated page
      - Page Allo cator Flag: `PAL_USER`: Obtain the pages from the user pool. 
   2. `void palloc_free_page (void *page)` 和`void palloc_free_multiple (void *pages, size_t page_cnt`

### Block allocator

1. 声明位置: `threads/malloc.h`, Block allocator分配的block来自kernel pool
2. 两种分配策略:
   1. 当block小于等于1KiB时, 分配的大小被约等于MAX(2的幂次方, 16字节), Then they are group ed into a page used only for allocations of that size.
   2. 当block大于1KiB时, 分配的大小将被约等于最接近的pages大小, 然后分配连续的pages.
   - `void * malloc (size_t size)`: 从kernel pool中返回一个new block
   - `void * calloc (size_t a, size_t b)`: a*b bytes long
   - `void * realloc (void *block, size_t new_size)`
   - `void free (void *block`

## Doubly Linked List

1. Pintos Linked List data stucture: `lib/kernel/list.h`
2. list_entry(LIST_ELEM, STRUCT, MEMBER):
   - 作用: 通过指向`LIST_ELEM`的指针**反推出**指向该`STRUCT`的指针, 简单点说, 如果知道了你的指纹, 可以反推出你是谁.
   - `LIST_ELEM`是指向`list_elem`的指针, `STRUCT`是结构体的名字, `MEMBER`表示`list_elem`在结构体`STRUCT`中的名字.
   - 这里的`list_elem`相当于Linux中的`list_head`.

      ```N
      The list_entry() macro works by computing the offset of the elem field inside of `struct int_list_elem`. In our example, this offset is 4 bytes. To convert a pointer to a generic `struct list_elem` to a pointer to our custom `struct int_list_elem`, the list_entry() just needs to subtract 4 bytes! (It also casts
      the pointer, in order to satisfy the C typ e system.)
      ```

3. 官方文档

    ```N
    /* List element. */
    struct list_elem {
    struct list_elem* prev; /* Previous list element. */
    struct list_elem* next; /* Next list element. */
    };

    /* List. */
    struct list {
    struct list_elem head; /* List head. */
    struct list_elem tail; /* List tail. */
    };

    /* Converts pointer to list element LIST_ELEM into a pointer to
   the structure that LIST_ELEM is embedded inside.  Supply the
   name of the outer structure STRUCT and the member name MEMBER
   of the list element.  See the big comment at the top of the
   file for an example. */
   #define list_entry(LIST_ELEM, STRUCT MEMBER)                                                      \
   ((STRUCT*)((uint8_t*)&(LIST_ELEM)->next - offsetof(STRUCT, MEMBER.next)))
    ```

## Debug

1. `printf`: 善用`printf`来缩小错误范围
2. `ASSERT(expression)`: 理想情况下, 每个函数都应该在开始时使用assert来检查参数的有效性.
3. 函数和参数属性:
   - `UNUSED`: 添加在函数参数之后, 告诉编译器该参数不会被使用
   - `NO_RETURN`: 在function prototype之后添加, 告诉编译器此函数不会return
   - `NO_INLINE`: tell the compiler to never emit the function in-line
   - `PRINTF_FORMAT (format, first)`: 类似于`printf`的格式的参数
4. `backtrace`: a summary of how your program got where it is, as a list of addresses inside the functions that were running at the time of the panic.
   1. **backtrace tool**: 将call stack 转化为可读形式, `backtrace kernel.o hexadecimal_numbers`; 也可以backtrace user program: `backtrace user_program hexadecimal_numbers`或`backtrace kernel.o Call stack`(???)
   - `debug_backtrace`: print a backtrace at any point in your code.
   - `debug_backtrace_all`: prints backtraces of all threads.

## FPU

1. 为用户程序执行浮点运算并不需要特定的硬件(kernel中的线程不需要浮点运算), 可通过必要的bit-level操作来对浮点值进行add, sub, multiplication, 但速度会慢许多.
2. FPI并没有自己的浮点寄存器, 而是有一个register stack. 
   - 如计算√π, 先push π to stack, 然后运行`fsqrt`, pop π, 然后将计算结果push to stack. 
   - `fadd`, pop two operands from the stack, add them together, push the result into stack. 

### Enabling the FPU

1. 在`src/threads/start.S`里面修改,
   - `- orl $CR0_PE | CR0_PG | CR0_WP | CR0_EM, %eax`
   - `+ orl $CR0_PE | CR0_PG | CR0_WP, %eax `

### FPU Initialization, Syscall

1. 通过write assembly code to interact with the FPU directly.
2. 需要向了解kernel目前时如何运行code的, 然后扩展它去支持floating-point.

3. FPU测试代码在`lib/stdio.c`中



## System Call

1. **external interrupts**: from I/O interrupt, caused by entities out of CPU.
2. **software exception**: events that occur in program code.
3. In pintos, user programs invokes `int $0x30` to make a system call. The system call number and any additional arguments are expected to be pushed on the stack **in the normal fashion** before invoking the interrupt; 
   1. `syscall_handler()`可以从`struct intr_frame`的`esp`成员中获得 caller stack pointer; syscall的return value也放入`struct intr_frame`的`eax`成员中.

### Process System Calls

1. `int practice(int i)`
2. `void halt(void)`: Terminates Pintos by calling `shutdown_power_off()` (declared in `devices/shutdown.h`).
3. `void exit(int status)`: Terminates the current user program, returning status to the kernel.
4. `pid_t exec (const char *cmd_line)`Runs the executable whose name is given in `cmd_line` , passing any given arguments, and returns the new process's program id ( pid ).
5. `int wait (pid_t pid)`: Waits for a child process pid and retrieves the child's exit status. If is still alive, waits until it terminates.

### File System Calls

1. `bool create (const char *file, unsigned initial_size)`
2. `bool remove (const char *file)`
3. `int open (const char *file)`: Opens the file called file. Returns a nonnegative integer handle called a file descriptor (fd), or -1 if the file could not be opened.
   - fd 0(STDIN_FILENO) is standard input.
   - fd 1(STDOUT_FILENO) is standrad output. 
4. `int filesize (int fd)`: Returns the size, in bytes, of the file open as fd.
5. `int read (int fd, void *buffer, unsigned size)`
6. `int write (int fd, const void *buffer, unsigned size)`
7. `void seek (int fd, unsigned position)`
8. `unsigned tell (int fd)`
9. `void close(fd)`

## 具体实现：

1. `loader.S`: This code should be stored in the first sector of a hard disk. When the BIOS runs, it loads this code at physical address 0x7c00-0x7e00 (512 bytes) and jumps to the beginning of it, in real mode.  The loader loads the kernel into memory and jumps to its entry point, which is the start function in start.S.
2. `start.S`: The loader (in loader.S) loads the kernel at physical address 0x20000 (128 kB) and jumps to "start", defined here.  This code switches from real mode to 32-bit protected mode and call main().