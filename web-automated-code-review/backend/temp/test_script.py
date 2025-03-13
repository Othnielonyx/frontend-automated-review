def greet(name):
    if name == "John":
        print("Hello, John!")
    elif name == "Jane":
        print("Hello, Jane!")
    else:
        print("Hello, stranger!")

def add(a, b):
    sum = a + b
    print("The sum is:", sum)
    return sum

def divide(a, b):
    try:
        result = a / b
        print("The result is:", result)
        return result
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return None

# Test the functions
greet("John")
add(5, 7)
divide(10, 0)
