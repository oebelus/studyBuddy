pub fn countdown(n: u32) -> Vec<u32> {
    for i in (0..n).rev() {
        println!("{}", i);
    }
    return vec![];
}

pub fn weekday_from_number(day: u8) -> &'static str {
    // TODO: Implement the function here
    match day {
        1 => "Monday",
        2 => "Tuesday",
        3 => "Wednesday",
        4 => "Thursday",
        5 => "Friday",
        6 => "Saturday",
        7 => "Sunday",
        _ => "Invalid day number",
    }
}
