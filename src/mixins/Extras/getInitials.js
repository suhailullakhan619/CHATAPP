function  getInitials(name) {
      if (!name) return "?";

      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }
    export default getInitials