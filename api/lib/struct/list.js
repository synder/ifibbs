/**
 * Created by synder on 16/9/23.
 */


const Node = function (value) {
    this.__value = value;
    this.__next = null;
    this.__prev = null;
};

Node.prototype.value = function (value) {

    if(arguments.length > 0){
        this.__value = value;
    }else{
        return this.__value;
    }
};

Node.prototype.next = function (next) {
    if(arguments.length > 0){
        if(!(next instanceof Node)){
            throw new Error('next is not a Node instance');
        }

        this.__next = next;
    }else{
        return this.__next;
    }
};

Node.prototype.prev = function (prev) {
    if(arguments.length > 0){
        if(!(prev instanceof Node)){
            throw new Error('prev is not a Node instance');
        }

        this.__prev = prev;
    }else{
        return this.__prev;
    }
};




//---单向链表---------------------------------------------------
const SinglyLinkedList = function () {
    this.__head = null;
    this.__tail = null;
};

SinglyLinkedList.prototype.head = function () {
    return this.__head;
};

SinglyLinkedList.prototype.tail = function () {
    return this.__tail;
};

SinglyLinkedList.prototype.add = function (element) {

    let node = new Node(element);

    if(!this.__head){
        this.__head = node;
        this.__tail = this.__head;
    }else{
        this.__tail.next(node);
    }
};

SinglyLinkedList.prototype.find = function (element) {
    if(!element){
        return null;
    }

    let current = this.__head;

    while (current && current.value() !== element){
        current = current.next();
    }

    return current;
};

SinglyLinkedList.prototype.insert = function (element, base) {
    let baseNode = this.find(base);

    if(!baseNode){
        return false;
    }

    let newNode = new Node(element);

    newNode.next(baseNode.next());
    baseNode.next(newNode);

    if(!baseNode.next()){
        this.__tail = newNode;
    }
};

SinglyLinkedList.prototype.remove = function (element) {
    let current = this.__head;

    while (current && current.next() && current.next().value() !== element){
        current = current.next();
    }

    if(!current){
        return false;
    }

    if(!current.next()){
        return false;
    }

    current.next(current.next().next());

    if(!current.next()){
        this.__tail = current;
    }
};

SinglyLinkedList.prototype.forEach = function (callback) {
    let current = this.__head;

    while (current){
        callback(current.value());
        current = current.next();
    }
};




//---双向链表---------------------------------------------------
let DoublyLinkedList = function () {
    this.__head = null;
    this.__tail = null;


};

DoublyLinkedList.prototype.head = function () {
    return this.__head;
};

DoublyLinkedList.prototype.tail = function () {
    return this.__tail;
};

DoublyLinkedList.prototype.add = function (element) {

    let node = new Node(element);

    if(!this.__head){
        this.__head = node;
        this.__tail = this.__head;
    }else{
        node.prev(this.__tail);
        this.__tail.next(node);
    }
};

DoublyLinkedList.prototype.find = function (element) {
    if(!element){
        return null;
    }

    let current = this.__head;

    while (current && current.value() !== element){
        current = current.next();
    }

    return current;
};

DoublyLinkedList.prototype.insert = function (element, base) {
    let baseNode = this.find(base);

    if(!baseNode){
        return false;
    }

    let newNode = new Node(element);

    newNode.next(baseNode.next());
    baseNode.next().prev(newNode);
    newNode.prev(baseNode);
    baseNode.next(newNode);

    if(!baseNode.next()){
        this.__tail = newNode;
    }
};

DoublyLinkedList.prototype.remove = function (element) {
    let current = this.find(element);

    if(!current){
        return false;
    }

    //head
    if(current.prev() === null){
        this.__head = current.next();
    }

    //tail
    if(current.next() === null){
        this.__tail = current.prev();
    }

    current.prev().next(current.next());
    current.next().prev(current.prev());
    current.next(null);
    current.prev(null);
};

DoublyLinkedList.prototype.forEach = function (callback) {
    let current = this.__head;

    while (current){
        callback(current.value());
        current = current.next();
    }
};


//---环形链表---------------------------------------------------
let CircularLinkedList = function (element) {
    this.__header = element;
    this.__head = new Node(element);
    this.__head.next(this.__head);
};

CircularLinkedList.prototype.find = function (element) {

    let current = this.__head;

    while (current.value() !== element && current.value() !== this.__header){
        current = current.next();
    }

    return current;
};

CircularLinkedList.prototype.insert = function (element, base) {
    let baseNode = this.find(base);

    if(!baseNode){
        return false;
    }

    let newNode = new Node(element);

    newNode.next(baseNode.next());
    baseNode.next(newNode);

    return true;
};

CircularLinkedList.prototype.remove = function (element) {

    let current = this.__head;

    while (current.next().value() !== element && current.next().value() !== this.__header){
        current = current.next();
    }

    current.next(current.next().next());
};

CircularLinkedList.prototype.forEach = function (callback) {
    let current = this.__head;

    while (current.next().value() !== this.__header){
        callback(current.value());
        current = current.next();
    }
};