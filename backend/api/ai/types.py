
from dataclasses import dataclass, asdict, fields
from typing import Dict, Any

@dataclass
class SerializableDataClass:
    """ data class with builtin asdict method """
    def to_dict(self) -> Dict:
        dict_ = {}
        for field in fields(self):
            val = getattr(self, field.name)
            # if val is self recurse
            if isinstance(val, SerializableDataClass):
                val = val.to_dict()
            # remove '_' placeholder at end of key
            if field.name.endswith('_'):
                key = field.name[0:-1]
            else:
                key = field.name
            dict_[key] = val
        return dict_

    def __getitem__(self, item: Any):
        return getattr(self, item)

@dataclass
class DecAttrs(SerializableDataClass):
    class_: str

@dataclass
class DecSpec(SerializableDataClass):
    correction: str | None
    attrs: DecAttrs

@dataclass
class Decoration(SerializableDataClass):
    from_: int
    to: int
    spec: DecSpec

