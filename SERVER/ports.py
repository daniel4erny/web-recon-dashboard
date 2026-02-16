def returnPorts():
    return [
        20, 21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445, 993, 995, 
        1723, 3306, 3389, 5900, 8080, 8443, 8000, 8081, 8888, 
        # Add scanme specific ports
        9929, 31337
    ] + [i for i in range(1000, 1025)] # Adding some common range